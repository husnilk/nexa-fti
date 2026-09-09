<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryAdjustment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'stock_opname_item_id',
        'warehouse_id',
        'item_id',
        'adjustment_quantity',
        'reason',
        'adjusted_by',
        'adjustment_date',
        'adjusted_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stock_opname_item_id' => 'integer',
            'warehouse_id' => 'integer',
            'item_id' => 'integer',
            'adjusted_by' => 'integer',
            'adjustment_date' => 'datetime',
            'adjusted_by_id' => 'integer',
        ];
    }

    public function stockOpnameItem(): BelongsTo
    {
        return $this->belongsTo(StockOpnameItem::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function adjustedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
