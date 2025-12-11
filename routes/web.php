<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\DesignerProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Design routes
    Route::get('/designs/create', function () {
        return view('designs.create');
    })->name('designs.create');

    // Swipe route
    Route::get('/swipe', function () {
        return view('swipe');
    })->name('swipe');

    // Categories management
    Route::get('/categories', function () {
        return view('categories');
    })->name('categories');

    // Designer profile and portfolio routes
    Route::get('/designer/{user}', [DesignerProfileController::class, 'show'])->name('designer.profile');
    Route::get('/designer/{user}/followers', [DesignerProfileController::class, 'followers'])->name('designer.followers');
    Route::get('/designer/{user}/following', [DesignerProfileController::class, 'following'])->name('designer.following');
    Route::post('/designer/{user}/follow', [DesignerProfileController::class, 'follow'])->name('designer.follow');
    Route::post('/designer/{user}/unfollow', [DesignerProfileController::class, 'unfollow'])->name('designer.unfollow');

    // Design annotation routes
    Route::get('/design/{design}', [DesignerProfileController::class, 'viewDesign'])->name('design.view');
    Route::post('/design/{design}/annotate', [DesignerProfileController::class, 'addAnnotation'])->name('design.annotate');
    Route::post('/annotation/{annotation}/comment', [DesignerProfileController::class, 'addComment'])->name('annotation.comment');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users');
    Route::patch('/users/{user}/role', [AdminDashboardController::class, 'updateUserRole'])->name('users.update-role');
    Route::delete('/users/{user}', [AdminDashboardController::class, 'deleteUser'])->name('users.delete');
    Route::get('/designs', [AdminDashboardController::class, 'designs'])->name('designs');
    Route::delete('/designs/{design}', [AdminDashboardController::class, 'deleteDesign'])->name('designs.delete');
    Route::get('/feedback', [AdminDashboardController::class, 'feedback'])->name('feedback');
    Route::delete('/feedback/{feedback}', [AdminDashboardController::class, 'deleteFeedback'])->name('feedback.delete');
    Route::get('/categories', [AdminDashboardController::class, 'categories'])->name('categories');
});

require __DIR__.'/auth.php';
