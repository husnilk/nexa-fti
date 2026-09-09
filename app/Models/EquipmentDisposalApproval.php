<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentDisposalApproval extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_disposal_id',
        'approver_id',
        'level',
        'status',
        'notes',
        'approved_at',
        'approver_id_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'equipment_disposal_id' => 'integer',
            'approver_id' => 'integer',
            'approved_at' => 'timestamp',
            'approver_id_id' => 'integer',
        ];
    }

    public function equipmentDisposal(): BelongsTo
    {
        return $this->belongsTo(EquipmentDisposal::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
