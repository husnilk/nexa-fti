<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentReceiptItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_receipt_id',
        'equipment_procurement_item_id',
        'unit_price',
        'quantity',
        'status',
        'rejection_reason',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_receipt_id' => 'string',
            'equipment_procurement_item_id' => 'string',
            'unit_price' => 'decimal:2',
        ];
    }

    public function equipmentReceipt(): BelongsTo
    {
        return $this->belongsTo(EquipmentReceipt::class);
    }

    public function equipmentProcurementItem(): BelongsTo
    {
        return $this->belongsTo(EquipmentProcurementItem::class);
    }
}
