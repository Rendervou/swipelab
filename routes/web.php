<?php

use App\Http\Controllers\Design\DesignController;
use App\Http\Controllers\SwipeController;

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DesignController::class, 'index'])->name('dashboard');
    Route::get('/upload', [DesignController::class, 'create']);
    Route::post('/upload', [DesignController::class, 'store']);
    Route::post('/swipe', [SwipeController::class, 'store'])->name('swipe');
});
