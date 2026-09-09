<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentReceipt extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_procurement_id',
        'receipt_number',
        'receipt_date',
        'received_by',
        'supplier_name',
        'invoice_number',
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
            'equipment_procurement_id' => 'string',
            'receipt_date' => 'date',
            'received_by' => 'string',
        ];
    }

    public function equipmentProcurement(): BelongsTo
    {
        return $this->belongsTo(EquipmentProcurement::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function equipmentReceiptItems(): HasMany
    {
        return $this->hasMany(EquipmentReceiptItem::class);
    }
}
