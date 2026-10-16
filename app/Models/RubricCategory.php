<?php

namespace App\Models;

use Database\Factories\RubricCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'code',
    'description',
])]
class RubricCategory extends Model
{
    /** @use HasFactory<RubricCategoryFactory> */
    use HasFactory, HasUuids;

    public function rubrics(): HasMany
    {
        return $this->hasMany(Rubric::class);
    }
}
