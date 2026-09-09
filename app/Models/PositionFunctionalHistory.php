<?php

namespace App\Models;

use Database\Factories\PositionFunctionalHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'lecturer_id', 'functional_position_id', 'start_date',
    'decree_number', 'decree_date', 'decree_signer', 'certificate_file',
])]
class PositionFunctionalHistory extends Model
{
    /** @use HasFactory<PositionFunctionalHistoryFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the lecturer that owns the history.
     */
    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(Lecturer::class);
    }

    /**
     * Get the functional position.
     */
    public function functionalPosition(): BelongsTo
    {
        return $this->belongsTo(FunctionalPosition::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'decree_date' => 'date',
        ];
    }
}
