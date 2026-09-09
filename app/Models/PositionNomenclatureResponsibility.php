<?php

namespace App\Models;

use Database\Factories\PositionNomenclatureResponsibilityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['position_nomenclature_id', 'name'])]
class PositionNomenclatureResponsibility extends Model
{
    /** @use HasFactory<PositionNomenclatureResponsibilityFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the nomenclature that owns the responsibility.
     */
    public function positionNomenclature(): BelongsTo
    {
        return $this->belongsTo(PositionNomenclature::class);
    }
}
