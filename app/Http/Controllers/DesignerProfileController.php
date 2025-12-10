<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Design;
use App\Models\FeedbackAnnotation;
use App\Models\Comment;
use Illuminate\Http\Request;

class DesignerProfileController extends Controller
{
    // View designer profile with portfolio
    public function show(User $user)
    {
        $designs = $user->designs()->with('category', 'user')->latest()->get();
        $followers_count = $user->followers()->count();
        $following_count = $user->following()->count();
        $is_following = auth()->check() ? auth()->user()->following()->where('following_id', $user->id)->exists() : false;

        return view('designer.profile', compact('user', 'designs', 'followers_count', 'following_count', 'is_following'));
    }

    // View specific design with annotation viewer
    public function viewDesign(Design $design)
    {
        $annotations = $design->annotations()
            ->with('user', 'comments.user')
            ->latest()
            ->get();

        return view('designer.view-design', compact('design', 'annotations'));
    }

    // Add annotation to design
    public function addAnnotation(Request $request, Design $design)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
            'coordinates' => 'required|json',
            'annotation_type' => 'in:comment,highlight,question',
        ]);

        $annotation = FeedbackAnnotation::create([
            'design_id' => $design->id,
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
            'coordinates' => $validated['coordinates'],
            'annotation_type' => $validated['annotation_type'] ?? 'comment',
        ]);

        return response()->json([
            'success' => true,
            'annotation' => $annotation,
            'user' => auth()->user()->only('id', 'name'),
        ]);
    }

    // Add comment to annotation
    public function addComment(Request $request, FeedbackAnnotation $annotation)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = Comment::create([
            'design_id' => $annotation->design_id,
            'user_id' => auth()->id(),
            'annotation_id' => $annotation->id,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user'),
        ]);
    }

    // Follow designer
    public function follow(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Cannot follow yourself');
        }

        auth()->user()->following()->attach($user->id);

        return back()->with('success', 'Now following ' . $user->name);
    }

    // Unfollow designer
    public function unfollow(User $user)
    {
        auth()->user()->following()->detach($user->id);

        return back()->with('success', 'Unfollowed ' . $user->name);
    }

    // View followers
    public function followers(User $user)
    {
        $followers = $user->followers()->paginate(12);

        return view('designer.followers', compact('user', 'followers'));
    }

    // View following
    public function following(User $user)
    {
        $following = $user->following()->paginate(12);

        return view('designer.following', compact('user', 'following'));
    }
}
