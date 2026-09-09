<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentDisposalItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'equipment_disposal_id',
        'equipment_id',
        'book_value',
        'disposal_value',
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
            'equipment_disposal_id' => 'string',
            'equipment_id' => 'string',
            'book_value' => 'decimal:2',
            'disposal_value' => 'decimal:2',
        ];
    }

    public function equipmentDisposal(): BelongsTo
    {
        return $this->belongsTo(EquipmentDisposal::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
