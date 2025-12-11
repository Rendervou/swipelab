<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'last_admin_login',
        'xp',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_admin_login' => 'datetime',
    ];

    // Relationships
    public function designs(): HasMany
    {
        return $this->hasMany(Design::class);
    }

    public function swipes(): HasMany
    {
        return $this->hasMany(Swipe::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function points()
    {
        return $this->hasOne(Points::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges');
    }

    // Social relationships
    public function followers()
    {
        return $this->belongsToMany(
            User::class,
            'user_follows',
            'following_id',
            'follower_id'
        )->withTimestamps();
    }

    public function following()
    {
        return $this->belongsToMany(
            User::class,
            'user_follows',
            'follower_id',
            'following_id'
        )->withTimestamps();
    }

    public function annotations(): HasMany
    {
        return $this->hasMany(FeedbackAnnotation::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
    public function getTotalPoints(): int
    {
        return $this->points?->total_points ?? $this->xp ?? 0;
    }

    public function getLevel(): int
    {
        $xp = $this->xp ?? 0;
        // Level 1: 0-50, Level 2: 50-150, Level 3: 150-300, Level 4: 300-500, etc.
        return max(1, intdiv($xp, 100) + 1);
    }

    // Role-based methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }
}
