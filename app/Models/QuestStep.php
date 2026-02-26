<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestStep extends Model
{
    protected $table = 'quest_steps';

    protected $fillable = [
        'quest_id',
        'step_order',
        'description',
        'is_optional',
    ];

    protected function casts(): array
    {
        return [
            'is_optional' => 'boolean',
        ];
    }

    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class);
    }

    public function userQuestSteps(): HasMany
    {
        return $this->hasMany(UserQuestStep::class, 'step_id');
    }
}
