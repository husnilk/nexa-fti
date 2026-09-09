<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentProcurement extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'procurement_number',
        'title',
        'description',
        'requested_by',
        'request_date',
        'status',
        'approved_by',
        'approved_at',
        'requested_by_id',
        'approved_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requested_by' => 'string',
            'request_date' => 'date',
            'approved_by' => 'string',
            'approved_at' => 'timestamp',
        ];
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function equipmentProcurementItems(): HasMany
    {
        return $this->hasMany(EquipmentProcurementItem::class);
    }

    public function equipmentProcurementApprovals(): HasMany
    {
        return $this->hasMany(EquipmentProcurementApproval::class);
    }
}
