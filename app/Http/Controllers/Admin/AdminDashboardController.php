<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Design;
use App\Models\Feedback;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_regular_users' => User::where('role', 'user')->count(),
            'total_designs' => Design::count(),
            'total_feedback' => Feedback::count(),
            'total_likes' => Design::sum('likes'),
            'total_views' => Design::sum('views'),
        ];

        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        $recentDesigns = Design::with('user')->orderBy('created_at', 'desc')->limit(5)->get();
        $topDesigns = Design::orderBy('likes', 'desc')->limit(5)->with('user')->get();

        return view('admin.dashboard', compact('stats', 'recentUsers', 'recentDesigns', 'topDesigns'));
    }

    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(15);
        return view('admin.users', compact('users'));
    }

    public function updateUserRole(User $user, Request $request)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user->update(['role' => $request->role]);

        return redirect()->back()->with('success', 'User role updated successfully');
    }

    public function deleteUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot delete your own account');
        }

        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function designs()
    {
        $designs = Design::with('user', 'category')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return view('admin.designs', compact('designs'));
    }

    public function deleteDesign(Design $design)
    {
        $design->delete();
        return redirect()->back()->with('success', 'Design deleted successfully');
    }

    public function feedback()
    {
        $feedback = Feedback::with('user', 'design')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return view('admin.feedback', compact('feedback'));
    }

    public function deleteFeedback(Feedback $feedback)
    {
        $feedback->delete();
        return redirect()->back()->with('success', 'Feedback deleted successfully');
    }

    public function categories()
    {
        $categories = \App\Models\Category::withCount('designs')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return view('admin.categories', compact('categories'));
    }
}
