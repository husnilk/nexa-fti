<?php

namespace App\Models;

use Database\Factories\StaffFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id', 'position_id', 'skills'])]
class Staff extends Model
{
    /** @use HasFactory<StaffFactory> */
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
     * Get the employee that owns the staff.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'id');
    }

    /**
     * Get the structural position.
     */
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * Get the nomenclature classification histories for the staff.
     */
    public function nomenclatureClassificationHistories(): HasMany
    {
        return $this->hasMany(NomenclatureClassificationHistory::class)->latest('start_date');
    }
}
