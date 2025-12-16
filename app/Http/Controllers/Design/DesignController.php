<?php

namespace App\Http\Controllers\Design;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Swipe;

class DesignController extends Controller
{
    // public function index()
    // {
    //     $swipedDesignIds = Swipe::where('user_id', auth()->id())
    //         ->pluck('design_id');

    //     $designs = Design::whereNotIn('id', $swipedDesignIds)
    //         ->latest()
    //         ->get();

    //     return view('designs.index', compact('designs'));
    // }
    public function index()
{
    $designs = \App\Models\Design::latest()->get();
    return view('designs.index', compact('designs'));
}


    public function create()
    {
        return view('designs.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'category' => 'required|in:uiux,poster,illustration',
        ]);

        $path = $request->file('image')->store('designs', 'public');

        Design::create([
            'title' => $request->title,
            'image' => $path,
            'category' => $request->category,
            'description' => $request->description,
            'user_id' => auth()->id(),
        ]);

        return redirect('/dashboard');
    }
}
