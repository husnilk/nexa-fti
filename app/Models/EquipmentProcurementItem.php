<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentProcurementItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_procurement_id',
        'equipment_model_id',
        'name',
        'specification',
        'quantity',
        'estimated_unit_price',
        'purchase_link',
        'photo',
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
            'equipment_model_id' => 'string',
            'estimated_unit_price' => 'decimal:2',
        ];
    }

    public function equipmentProcurement(): BelongsTo
    {
        return $this->belongsTo(EquipmentProcurement::class);
    }

    public function equipmentModel(): BelongsTo
    {
        return $this->belongsTo(EquipmentModel::class);
    }
}
