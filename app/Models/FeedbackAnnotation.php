<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeedbackAnnotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'design_id',
        'user_id',
        'comment',
        'coordinates',
        'annotation_type',
    ];

    protected $casts = [
        'coordinates' => 'json',
    ];

    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'annotation_id');
    }
}
