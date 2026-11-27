<?php

namespace App\Models;

use Database\Factories\RubricRegulationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'regulation_number',
    'regulation_year',
    'description',
    'file_path',
    'is_active',
])]
class RubricRegulation extends Model
{
    /** @use HasFactory<RubricRegulationFactory> */
    use HasFactory, HasUuids;

    public const STATUS_INACTIVE = 0;

    public const STATUS_ACTIVE = 1;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'integer',
        ];
    }

    public function rubrics(): HasMany
    {
        return $this->hasMany(Rubric::class);
    }

    public function isActive(): bool
    {
        return $this->is_active === self::STATUS_ACTIVE;
    }

    /**
     * @param  Builder<RubricRegulation>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', self::STATUS_ACTIVE);
    }
}
