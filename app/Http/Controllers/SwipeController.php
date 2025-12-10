<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Swipe;
use App\Models\Points;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

class SwipeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Get random design to swipe
    public function getRandomDesign(Request $request)
    {
        $categoryId = $request->query('category_id');
        $userId = Auth::id();

        $query = Design::where('user_id', '!=', $userId)
            ->whereDoesntHave('swipes', function (Builder $query) use ($userId) {
                $query->where('user_id', $userId);
            });

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $design = $query->inRandomOrder()->first();

        if (!$design) {
            return response()->json(['message' => 'No designs available'], 404);
        }

        // Increment views
        $design->increment('views');

        return response()->json($design->load('category', 'user'));
    }

    // Swipe left (dislike)
    public function swipeLeft(Request $request)
    {
        return $this->handleSwipe($request, 'left');
    }

    // Swipe right (like)
    public function swipeRight(Request $request)
    {
        return $this->handleSwipe($request, 'right');
    }

    // Handle swipe logic
    private function handleSwipe(Request $request, $direction)
    {
        $validated = $request->validate([
            'design_id' => 'required|exists:designs,id',
        ]);

        $userId = Auth::id();
        $designId = $validated['design_id'];

        // Check if already swiped
        $existingSwipe = Swipe::where('user_id', $userId)
            ->where('design_id', $designId)
            ->first();

        if ($existingSwipe) {
            return response()->json(['message' => 'Already swiped on this design'], 400);
        }

        // Create swipe
        $swipe = Swipe::create([
            'user_id' => $userId,
            'design_id' => $designId,
            'direction' => $direction,
        ]);

        // If swipe right (like), add points to design owner
        if ($direction === 'right') {
            $design = Design::find($designId);
            $design->increment('likes');
            
            // Add like points to owner
            $this->addPointsToUser($design->user_id, 'like', 2);
        }

        return response()->json([
            'message' => 'Swipe recorded',
            'swipe' => $swipe,
        ], 201);
    }

    // Get user swipe history
    public function getHistory()
    {
        $swipes = Auth::user()->swipes()
            ->with(['design.category', 'design.user'])
            ->latest()
            ->paginate(10);

        return response()->json($swipes);
    }

    // Helper method
    private function addPointsToUser($userId, $type, $points)
    {
        $userPoints = Points::firstOrCreate(['user_id' => $userId]);
        
        if ($type === 'like') {
            $userPoints->like_points += $points;
        }
        
        $userPoints->total_points += $points;
        $userPoints->save();

        // Award badges
        $this->checkAndAwardBadges($userId);
    }

    private function checkAndAwardBadges($userId)
    {
        $points = Points::where('user_id', $userId)->first();
        if (!$points) return;

        $badges = \App\Models\Badge::where('required_points', '<=', $points->total_points)->get();
        
        $user = \App\Models\User::find($userId);
        foreach ($badges as $badge) {
            $user->badges()->syncWithoutDetaching($badge->id);
        }
    }
}
