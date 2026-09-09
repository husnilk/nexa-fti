<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentAudit extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'audit_number',
        'audit_date',
        'conducted_by',
        'notes',
        'conducted_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'audit_date' => 'date',
            'conducted_by' => 'integer',
            'conducted_by_id' => 'integer',
        ];
    }

    public function conductedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function equipmentAuditDetails(): HasMany
    {
        return $this->hasMany(EquipmentAuditDetail::class);
    }
}
