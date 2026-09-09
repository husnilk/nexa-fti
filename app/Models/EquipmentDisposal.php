<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentDisposal extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'disposal_number',
        'disposal_date',
        'title',
        'reason',
        'disposal_method',
        'status',
        'proposed_by',
        'approved_by',
        'approved_at',
        'notes',
        'proposed_by_id',
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
            'disposal_date' => 'date',
            'proposed_by' => 'string',
            'approved_by' => 'string',
            'approved_at' => 'timestamp',
            'proposed_by_id' => 'string',
            'approved_by_id' => 'string',
        ];
    }

    public function proposedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function equipmentDisposalItems(): HasMany
    {
        return $this->hasMany(EquipmentDisposalItem::class);
    }

    public function equipmentDisposalApprovals(): HasMany
    {
        return $this->hasMany(EquipmentDisposalApproval::class);
    }
}
