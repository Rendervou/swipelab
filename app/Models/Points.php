<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Points extends Model
{
    use HasFactory;

    protected $table = 'points';

    protected $fillable = ['user_id', 'total_points', 'upload_points', 'like_points', 'feedback_points'];

    protected $hidden = ['updated_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
