<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\SwipeController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Auth required routes
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Categories (CRUD)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Designs
    Route::get('/designs/my', [DesignController::class, 'myDesigns']);
    Route::get('/designs/{design}', [DesignController::class, 'show']);
    Route::post('/designs', [DesignController::class, 'store']);
    Route::put('/designs/{design}', [DesignController::class, 'update']);
    Route::delete('/designs/{design}', [DesignController::class, 'destroy']);

    // Swipe System
    Route::get('/swipe/random', [SwipeController::class, 'getRandomDesign']);
    Route::post('/swipe/left', [SwipeController::class, 'swipeLeft']);
    Route::post('/swipe/right', [SwipeController::class, 'swipeRight']);
    Route::get('/swipe/history', [SwipeController::class, 'getHistory']);

    // Feedback
    Route::get('/designs/{design}/feedback', [FeedbackController::class, 'getDesignFeedback']);
    Route::get('/feedback/received', [FeedbackController::class, 'myFeedbackReceived']);
    Route::get('/feedback/given', [FeedbackController::class, 'myFeedbackGiven']);
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::put('/feedback/{feedback}', [FeedbackController::class, 'update']);
    Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile/{username}', [DashboardController::class, 'userProfile']);
});

