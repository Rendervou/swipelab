<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Design;
use App\Models\Points;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Get feedback for a design
    public function getDesignFeedback(Design $design)
    {
        $feedback = $design->feedbacks()
            ->with('user')
            ->latest()
            ->paginate(10);

        return response()->json($feedback);
    }

    // Get user's feedback received
    public function myFeedbackReceived()
    {
        $userId = Auth::id();
        
        $feedback = Feedback::whereHas('design', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['user', 'design'])
        ->latest()
        ->paginate(10);

        return response()->json($feedback);
    }

    // Get user's feedback given
    public function myFeedbackGiven()
    {
        $feedback = Auth::user()->feedbacks()
            ->with(['design.user'])
            ->latest()
            ->paginate(10);

        return response()->json($feedback);
    }

    // Store feedback
    public function store(Request $request)
    {
        $validated = $request->validate([
            'design_id' => 'required|exists:designs,id',
            'comment' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Check if user already gave feedback
        $existingFeedback = Feedback::where('user_id', Auth::id())
            ->where('design_id', $validated['design_id'])
            ->first();

        if ($existingFeedback) {
            return response()->json(['message' => 'You already provided feedback for this design'], 400);
        }

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'design_id' => $validated['design_id'],
            'comment' => $validated['comment'],
            'rating' => $validated['rating'],
        ]);

        // Add feedback points to feedback giver
        $this->addPointsToUser(Auth::id(), 'feedback', 1);

        return response()->json($feedback->load('user'), 201);
    }

    // Update feedback
    public function update(Request $request, Feedback $feedback)
    {
        // Authorize
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'comment' => 'sometimes|string|max:500',
            'rating' => 'sometimes|integer|min:1|max:5',
        ]);

        $feedback->update($validated);
        return response()->json($feedback);
    }

    // Delete feedback
    public function destroy(Feedback $feedback)
    {
        // Authorize
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback->delete();
        return response()->json(null, 204);
    }

    // Helper method
    private function addPointsToUser($userId, $type, $points)
    {
        $userPoints = Points::firstOrCreate(['user_id' => $userId]);
        
        if ($type === 'feedback') {
            $userPoints->feedback_points += $points;
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
