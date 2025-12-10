<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        
        $data = [
            'user' => $user,
            'total_uploads' => $user->designs()->count(),
            'total_likes' => $user->designs()->sum('likes'),
            'feedback_received' => $user->designs()->sum(function ($design) {
                return $design->feedbacks()->count();
            }),
            'total_points' => $user->getTotalPoints(),
            'level' => $user->getLevel(),
            'badges' => $user->badges()->get(),
            'recent_designs' => $user->designs()->latest()->take(5)->get(),
            'recent_feedback' => $user->designs()
                ->with('feedbacks.user')
                ->latest()
                ->take(5)
                ->get()
                ->flatMap->feedbacks,
        ];

        return response()->json($data);
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
