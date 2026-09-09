<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryProcurement extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_number',
        'title',
        'status',
        'created_by',
        'approved_at',
        'created_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_by' => 'integer',
            'approved_at' => 'timestamp',
            'created_by_id' => 'integer',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function inventoryProcurementItems(): HasMany
    {
        return $this->hasMany(InventoryProcurementItem::class);
    }

    public function inventoryProcurementApprovals(): HasMany
    {
        return $this->hasMany(InventoryProcurementApproval::class);
    }

    public function inventoryReceipts(): HasMany
    {
        return $this->hasMany(InventoryReceipt::class);
    }
}
