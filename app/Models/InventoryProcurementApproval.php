<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryProcurementApproval extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inventory_procurement_id',
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
            'inventory_procurement_id' => 'integer',
            'approver_id' => 'integer',
            'approved_at' => 'timestamp',
            'approver_id_id' => 'integer',
        ];
    }

    public function inventoryProcurement(): BelongsTo
    {
        return $this->belongsTo(InventoryProcurement::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
