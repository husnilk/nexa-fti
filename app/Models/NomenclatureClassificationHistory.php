<?php

namespace App\Models;

use Database\Factories\NomenclatureClassificationHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'staff_id', 'nomenclature_classification_id', 'start_date', 'end_date',
    'decree_number', 'decree_date', 'decree_signer', 'decree_file',
])]
class NomenclatureClassificationHistory extends Model
{
    /** @use HasFactory<NomenclatureClassificationHistoryFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the staff that owns the history.
     */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    /**
     * Get the nomenclature classification.
     */
    public function nomenclatureClassification(): BelongsTo
    {
        return $this->belongsTo(PositionNomenclatureClassification::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'decree_date' => 'date',
        ];
    }
}
