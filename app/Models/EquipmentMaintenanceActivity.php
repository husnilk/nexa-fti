<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentMaintenanceActivity extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_maintenance_request_id',
        'activity_date',
        'description',
        'cost',
        'performed_by',
        'status',
        'notes',
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
            'equipment_maintenance_request_id' => 'integer',
            'activity_date' => 'datetime',
            'cost' => 'decimal:2',
        ];
    }

    public function equipmentMaintenanceRequest(): BelongsTo
    {
        return $this->belongsTo(EquipmentMaintenanceRequest::class);
    }
}
