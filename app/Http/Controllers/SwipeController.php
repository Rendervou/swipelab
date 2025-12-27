<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Swipe;

class SwipeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'design_id' => 'required|integer|exists:designs,id',
            'type' => 'required|in:like,skip',
        ]);

        Swipe::create([
            'user_id' => auth()->id(),
            'design_id' => $request->design_id,
            'type' => $request->type,
        ]);

        return response()->json(['status' => 'success']);
    }
}
