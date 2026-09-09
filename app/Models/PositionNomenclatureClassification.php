<?php

namespace App\Models;

use Database\Factories\PositionNomenclatureClassificationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['position_nomenclature_id', 'name', 'description'])]
class PositionNomenclatureClassification extends Model
{
    /** @use HasFactory<PositionNomenclatureClassificationFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the nomenclature that owns the classification.
     */
    public function positionNomenclature(): BelongsTo
    {
        return $this->belongsTo(PositionNomenclature::class);
    }
}
