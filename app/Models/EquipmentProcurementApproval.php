<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentProcurementApproval extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_procurement_id',
        'approver_id',
        'level',
        'status',
        'notes',
        'approved_at',
        'approver_id_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_procurement_id' => 'string',
            'approver_id' => 'string',
            'approved_at' => 'timestamp',
        ];
    }

    public function equipmentProcurement(): BelongsTo
    {
        return $this->belongsTo(EquipmentProcurement::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
