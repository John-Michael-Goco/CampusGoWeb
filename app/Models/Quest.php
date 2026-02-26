<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quest extends Model
{
    protected $fillable = [
        'title',
        'description',
        'quest_type',
        'required_steps',
        'created_by_user_id',
        'location_id',
        'is_repeatable',
        'difficulty',
    ];

    protected function casts(): array
    {
        return [
            'is_repeatable' => 'boolean',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(QuestStep::class)->orderBy('step_order');
    }

    public function userQuests(): HasMany
    {
        return $this->hasMany(UserQuest::class);
    }

    public function userQuestSteps(): HasMany
    {
        return $this->hasMany(UserQuestStep::class);
    }

    public function rewards(): BelongsToMany
    {
        return $this->belongsToMany(Reward::class, 'quest_rewards');
    }
}
