<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryIssueItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inventory_issue_id',
        'inventory_issue_item_id',
        'quantity',
        'inventory_request_item_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'inventory_issue_id' => 'integer',
            'inventory_issue_item_id' => 'integer',
            'inventory_request_item_id' => 'integer',
        ];
    }

    public function inventoryIssue(): BelongsTo
    {
        return $this->belongsTo(InventoryIssue::class);
    }

    public function inventoryRequestItem(): BelongsTo
    {
        return $this->belongsTo(InventoryRequestItem::class);
    }

    public function inventoryIssueItem(): BelongsTo
    {
        return $this->belongsTo(InventoryRequestItem::class);
    }
}
