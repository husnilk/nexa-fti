<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_model_id',
        'equipment_number',
        'serial_number',
        'acquisition_date',
        'acquisition_cost',
        'residual_value',
        'useful_life',
        'condition',
        'status',
        'qr_code',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_model_id' => 'integer',
            'acquisition_date' => 'date',
            'acquisition_cost' => 'decimal:2',
            'residual_value' => 'decimal:2',
        ];
    }

    public function equipmentModel(): BelongsTo
    {
        return $this->belongsTo(EquipmentModel::class);
    }

    public function equipmentDistributions(): HasMany
    {
        return $this->hasMany(EquipmentDistribution::class);
    }

    public function equipmentUsages(): HasMany
    {
        return $this->hasMany(EquipmentUsage::class);
    }

    public function equipmentMaintenanceRequests(): HasMany
    {
        return $this->hasMany(EquipmentMaintenanceRequest::class);
    }

    public function equipmentTrackings(): HasMany
    {
        return $this->hasMany(EquipmentTracking::class);
    }

    public function equipmentDocuments(): HasMany
    {
        return $this->hasMany(EquipmentDocument::class);
    }

    public function equipmentAuditDetails(): HasMany
    {
        return $this->hasMany(EquipmentAuditDetail::class);
    }

    public function equipmentDepreciations(): HasMany
    {
        return $this->hasMany(EquipmentDepreciation::class);
    }

    public function equipmentDisposalItems(): HasMany
    {
        return $this->hasMany(EquipmentDisposalItem::class);
    }
}
