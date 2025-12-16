<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Design extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'image',
        'category',
        'description',
    ];

    /**
     * Relasi: satu design punya banyak swipe
     */
    public function swipes()
    {
        return $this->hasMany(Swipe::class);
    }
}
