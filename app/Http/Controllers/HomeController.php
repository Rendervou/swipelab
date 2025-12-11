<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Display the home page with featured designs, recent uploads, and top reviewers
     */
    public function index()
    {
        // Get featured designs (limit 4)
        $featuredDesigns = Design::where('is_featured', true)
            ->where('status', 'approved')
            ->with(['user', 'category', 'feedbacks'])
            ->latest('created_at')
            ->limit(4)
            ->get()
            ->map(fn($design) => $this->formatDesignData($design));

        // Get recent designs (limit 8)
        $recentDesigns = Design::where('status', 'approved')
            ->with(['user', 'category', 'feedbacks'])
            ->latest('created_at')
            ->limit(8)
            ->get()
            ->map(fn($design) => $this->formatDesignData($design));

        // Get top reviewers (limit 5) - based on feedback count
        $topReviewers = User::withCount('feedbacks')
            ->orderBy('feedbacks_count', 'desc')
            ->orderBy('xp', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($user) => $this->formatUserData($user));

        // Get current user if authenticated
        $currentUser = Auth::user() ? $this->formatUserData(Auth::user()) : null;

        // Platform stats
        $stats = [
            'total_designs' => Design::where('status', 'approved')->count(),
            'total_feedbacks' => \App\Models\Feedback::count(),
            'total_designers' => User::count(),
        ];

        return view('welcome', [
            'featuredDesigns' => $featuredDesigns,
            'recentDesigns' => $recentDesigns,
            'topReviewers' => $topReviewers,
            'currentUser' => $currentUser,
            'stats' => $stats,
        ]);
    }

    /**
     * Format design data for display
     */
    private function formatDesignData(Design $design)
    {
        return [
            'id' => $design->id,
            'title' => $design->title,
            'image_url' => $design->image_url,
            'category' => $design->category?->name ?? 'Uncategorized',
            'designer' => [
                'name' => $design->user->name,
                'avatar' => $design->user->avatar_url ?? null,
                'initials' => strtoupper(substr($design->user->name, 0, 1)),
            ],
            'feedback_count' => $design->feedbacks()->count(),
            'likes_count' => $design->likes,
            'is_featured' => $design->is_featured,
            'created_at' => $design->created_at->format('M d, Y'),
            'view_url' => route('design.view', $design->id),
        ];
    }

    /**
     * Format user data for display
     */
    private function formatUserData(User $user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar_url ?? null,
            'initials' => strtoupper(substr($user->name, 0, 1)),
            'xp' => $user->xp ?? 0,
            'level' => $user->getLevel() ?? 1,
            'feedback_count' => $user->feedbacks()->count(),
            'profile_url' => route('designer.profile', $user->name),
        ];
    }
}
