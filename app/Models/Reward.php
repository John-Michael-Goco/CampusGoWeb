<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Reward extends Model
{
    protected $fillable = [
        'reward_type',
        'amount',
        'reference_id',
        'is_scalable',
    ];

    protected function casts(): array
    {
        return [
            'is_scalable' => 'boolean',
        ];
    }

    public function quests(): BelongsToMany
    {
        return $this->belongsToMany(Quest::class, 'quest_rewards');
    }
}
