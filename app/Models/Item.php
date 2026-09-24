<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'item_category_id',
        'name',
        'code',
        'unit',
        'minimal_quantity',
        'description',
        'picture',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'picture_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'item_category_id' => 'integer',
        ];
    }

    /**
     * Get the public URL for the item picture.
     */
    public function getPictureUrlAttribute(): ?string
    {
        return $this->picture ? asset('storage/'.$this->picture) : null;
    }

    /**
     * Get the variants for the item.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ItemVariant::class);
    }

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    public function inventoryProcurementItems(): HasMany
    {
        return $this->hasMany(InventoryProcurementItem::class);
    }

    public function inventoryReceiptItems(): HasMany
    {
        return $this->hasMany(InventoryReceiptItem::class);
    }

    public function inventoryRequestDetails(): HasMany
    {
        return $this->hasMany(InventoryRequestDetail::class);
    }

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function inventoryIssueItems(): HasMany
    {
        return $this->hasMany(InventoryIssueItem::class);
    }

    public function stockOpnameItems(): HasMany
    {
        return $this->hasMany(StockOpnameItem::class);
    }

    public function inventoryAdjustments(): HasMany
    {
        return $this->hasMany(InventoryAdjustment::class);
    }

    public function itemCategory(): BelongsTo
    {
        return $this->belongsTo(ItemCategory::class);
    }
}
