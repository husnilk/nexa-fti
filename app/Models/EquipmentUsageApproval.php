<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentUsageApproval extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_usage_id',
        'approver_id',
        'level',
        'status',
        'notes',
        'approved_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_usage_id' => 'string',
            'approver_id' => 'string',
            'approved_at' => 'timestamp',
        ];
    }

    public function equipmentUsage(): BelongsTo
    {
        return $this->belongsTo(EquipmentUsage::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
