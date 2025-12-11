<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Design;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        
        // Get user statistics
        $stats = [
            'designs_count' => $user->designs()->count(),
            'total_likes' => $user->designs()->sum('likes'),
            'feedback_count' => $user->designs()->withCount('feedbacks')->get()->sum('feedbacks_count'),
            'total_points' => $user->getTotalPoints(),
        ];

        // Get recent designs with relationships
        $recentDesigns = $user->designs()
            ->with(['category', 'feedbacks'])
            ->latest()
            ->take(5)
            ->get();

        return view('dashboard', compact('stats', 'recentDesigns'));
    }

    public function userProfile($username)
    {
        $user = User::where('name', $username)->firstOrFail();
        
        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'total_uploads' => $user->designs()->count(),
            'total_likes' => $user->designs()->sum('likes'),
            'total_points' => $user->getTotalPoints(),
            'level' => $user->getLevel(),
            'badges' => $user->badges()->get(),
            'public_designs' => $user->designs()
                ->with('category')
                ->latest()
                ->paginate(10),
        ];

        return response()->json($data);
    }
}