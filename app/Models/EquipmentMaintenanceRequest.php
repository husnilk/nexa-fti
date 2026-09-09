<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentMaintenanceRequest extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_id',
        'reported_by',
        'report_date',
        'problem_description',
        'priority',
        'status',
        'notes',
        'photo',
        'estimated_cost',
        'actual_cost',
        'reported_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'report_date' => 'date',
            'estimated_cost' => 'decimal:2',
            'actual_cost' => 'decimal:2',
        ];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function reportedByEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reported_by_id');
    }

    public function reportedBy(): BelongsTo
    {
        return $this->reportedByEmployee();
    }

    public function equipmentMaintenanceActivities(): HasMany
    {
        return $this->hasMany(EquipmentMaintenanceActivity::class);
    }
}
