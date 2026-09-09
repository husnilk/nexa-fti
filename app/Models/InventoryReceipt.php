<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryReceipt extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inventory_procurement_id',
        'warehouse_id',
        'receipt_number',
        'receipt_date',
        'received_by',
        'received_by_id',
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
            'warehouse_id' => 'integer',
            'receipt_date' => 'date',
            'received_by' => 'integer',
            'received_by_id' => 'integer',
        ];
    }

    public function inventoryProcurement(): BelongsTo
    {
        return $this->belongsTo(InventoryProcurement::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'received_by');
    }

    public function inventoryReceiptItems(): HasMany
    {
        return $this->hasMany(InventoryReceiptItem::class);
    }
}
