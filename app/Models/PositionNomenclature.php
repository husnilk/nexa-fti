<?php

namespace App\Models;

use Database\Factories\PositionNomenclatureFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'grade', 'qualification'])]
class PositionNomenclature extends Model
{
    /** @use HasFactory<PositionNomenclatureFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the responsibilities for the nomenclature.
     */
    public function responsibilities(): HasMany
    {
        return $this->hasMany(PositionNomenclatureResponsibility::class);
    }

    /**
     * Get the classifications for the nomenclature.
     */
    public function classifications(): HasMany
    {
        return $this->hasMany(PositionNomenclatureClassification::class);
    }
}
