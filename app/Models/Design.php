<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Design extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'category_id', 'title', 'description', 'image_path', 'is_featured', 'status', 'views', 'likes'];

    protected $hidden = ['image_path'];

    protected $appends = ['image_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function swipes(): HasMany
    {
        return $this->hasMany(Swipe::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function annotations(): HasMany
    {
        return $this->hasMany(FeedbackAnnotation::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Fixed getImageUrlAttribute method
    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}