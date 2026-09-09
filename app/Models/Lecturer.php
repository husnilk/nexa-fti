<?php

namespace App\Models;

use Database\Factories\LecturerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id', 'academic_rank', 'functional_position_id', 'nuptk', 'expertise'])]
class Lecturer extends Model
{
    /** @use HasFactory<LecturerFactory> */
    use HasFactory;

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Get the employee that owns the lecturer.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'id');
    }

    /**
     * Get the functional position.
     */
    public function functionalPosition(): BelongsTo
    {
        return $this->belongsTo(FunctionalPosition::class);
    }

    /**
     * Get the functional position histories for the lecturer.
     */
    public function functionalPositionHistories(): HasMany
    {
        return $this->hasMany(PositionFunctionalHistory::class)->latest('start_date');
    }
}
