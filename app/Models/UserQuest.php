<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserQuest extends Model
{
    protected $table = 'user_quests';

    protected $fillable = [
        'user_id',
        'quest_id',
        'current_step',
        'completed',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class);
    }

    public function userQuestSteps(): HasMany
    {
        return $this->hasMany(UserQuestStep::class, 'quest_id', 'quest_id')
            ->where('user_id', $this->user_id);
    }
}
