<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SwipeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Design\DesignController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DesignController::class, 'index'])->name('dashboard');
    Route::get('/upload', [DesignController::class, 'create']);
    Route::post('/upload', [DesignController::class, 'store']);
});
Route::post('/swipe', [SwipeController::class, 'store'])->middleware('auth');



require __DIR__.'/auth.php';
