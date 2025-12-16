<?php

namespace App\Http\Controllers;

use App\Models\Swipe;
use App\Models\Design;
use Illuminate\Http\Request;

class SwipeController extends Controller
{
    public function store(Request $request)
    {
        Swipe::create([
            'user_id' => auth()->id(),
            'design_id' => $request->design_id,
            'type' => $request->type, // like / skip
        ]);

        return back();
    }
}
