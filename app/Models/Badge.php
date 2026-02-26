<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'xp_reward',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }
}
