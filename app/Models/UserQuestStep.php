<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserQuestStep extends Model
{
    protected $table = 'user_quest_steps';

    protected $fillable = [
        'user_id',
        'quest_id',
        'step_id',
        'completed_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
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

    public function step(): BelongsTo
    {
        return $this->belongsTo(QuestStep::class, 'step_id');
    }
}
