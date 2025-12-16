<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Swipe extends Model
{
    protected $fillable = [
        'user_id',
        'design_id',
        'type',
    ];
}
