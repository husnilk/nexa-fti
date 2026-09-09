<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentUsage extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_id',
        'borrower_type',
        'borrower_id',
        'planned_start_date',
        'planned_return_date',
        'actual_start_date',
        'actual_return_date',
        'purpose',
        'status',
        'approved_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_id' => 'string',
            'borrower_id' => 'string',
            'planned_start_date' => 'datetime',
            'planned_return_date' => 'datetime',
            'actual_start_date' => 'datetime',
            'actual_return_date' => 'datetime',
            'approved_by' => 'string',
        ];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function borrower(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function equipmentUsageApprovals(): HasMany
    {
        return $this->hasMany(EquipmentUsageApproval::class);
    }
}
