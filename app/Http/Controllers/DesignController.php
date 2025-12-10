<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Category;
use App\Models\Points;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DesignController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Get user's own designs
    public function myDesigns()
    {
        $designs = Auth::user()->designs()->with('category')->latest()->paginate(10);
        return response()->json($designs);
    }

    // Get specific design
    public function show(Design $design)
    {
        return response()->json($design->load('category', 'user'));
    }

    // Upload new design
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png|max:10240',
        ]);

        // Store image
        $imagePath = $request->file('image')->store('designs', 'public');

        // Create design
        $design = Design::create([
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);

        // Add upload points
        $this->addPoints(Auth::user(), 'upload', 10);

        return response()->json($design->load('category', 'user'), 201);
    }

    // Update design
    public function update(Request $request, Design $design)
    {
        // Authorize
        if ($design->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        $design->update($validated);
        return response()->json($design);
    }

    // Delete design
    public function destroy(Design $design)
    {
        // Authorize
        if ($design->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete image
        if (Storage::disk('public')->exists($design->image_path)) {
            Storage::disk('public')->delete($design->image_path);
        }

        $design->delete();
        return response()->json(null, 204);
    }

    // Helper method to add points
    private function addPoints($user, $type, $points)
    {
        $userPoints = Points::firstOrCreate(['user_id' => $user->id]);
        
        switch ($type) {
            case 'upload':
                $userPoints->upload_points += $points;
                break;
            case 'like':
                $userPoints->like_points += $points;
                break;
            case 'feedback':
                $userPoints->feedback_points += $points;
                break;
        }
        
        $userPoints->total_points += $points;
        $userPoints->save();

        // Check for new badges
        $this->checkAndAwardBadges($user);
    }

    // Check and award badges based on points
    private function checkAndAwardBadges($user)
    {
        $points = Points::where('user_id', $user->id)->first();
        if (!$points) return;

        $badges = \App\Models\Badge::where('required_points', '<=', $points->total_points)->get();
        
        foreach ($badges as $badge) {
            $user->badges()->syncWithoutDetaching($badge->id);
        }
    }
}
