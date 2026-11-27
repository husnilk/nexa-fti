<?php

namespace App\Models;

use Database\Factories\RubricFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'rubric_category_id',
    'rubric_regulation_id',
    'activity',
    'code',
    'description',
    'description_prove',
    'quantity',
    'unit',
    'form_type',
    'personal',
    'assignment_file',
    'performance_file',
    'flat_rate',
    'is_poin_fixed',
    'is_extra_poin',
    'is_rasionalized',
    'is_general',
    'is_active',
    'is_flat_rate',
    'rule_max_poin',
    'rule_min_poin',
    'rule_max_employee',
    'rule_min_employee',
])]
class Rubric extends Model
{
    /** @use HasFactory<RubricFactory> */
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
            'quantity' => 'float',
            'form_type' => 'integer',
            'personal' => 'integer',
            'flat_rate' => 'integer',
            'is_poin_fixed' => 'integer',
            'is_extra_poin' => 'integer',
            'is_rasionalized' => 'integer',
            'is_general' => 'integer',
            'is_active' => 'integer',
            'is_flat_rate' => 'integer',
            'rule_max_poin' => 'integer',
            'rule_min_poin' => 'integer',
            'rule_max_employee' => 'integer',
            'rule_min_employee' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(RubricCategory::class, 'rubric_category_id');
    }

    public function regulation(): BelongsTo
    {
        return $this->belongsTo(RubricRegulation::class, 'rubric_regulation_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(RubricDetail::class);
    }

    public function organizations(): HasMany
    {
        return $this->hasMany(RubricOrganization::class);
    }

    public function employmentTypes(): HasMany
    {
        return $this->hasMany(RubricEmploymentType::class);
    }

    public function isActive(): bool
    {
        return $this->is_active === self::STATUS_ACTIVE;
    }

    /**
     * Limit to rubrics whose regulation is active.
     *
     * @param  Builder<Rubric>  $query
     */
    public function scopeWithActiveRegulation(Builder $query): void
    {
        $query->whereHas('regulation', fn (Builder $regulation) => $regulation->active());
    }

    /**
     * Limit to rubrics an organization may use: unrestricted rubrics (no
     * organization assignments) plus those explicitly assigned to it.
     *
     * @param  Builder<Rubric>  $query
     */
    public function scopeAvailableToOrganization(Builder $query, string $organizationId): void
    {
        $query->where(fn (Builder $query) => $query
            ->whereDoesntHave('organizations')
            ->orWhereHas('organizations', fn (Builder $assignment) => $assignment->where('organization_id', $organizationId)));
    }

    /**
     * Limit to rubrics explicitly allowed for an employment type.
     *
     * @param  Builder<Rubric>  $query
     */
    public function scopeAvailableToEmploymentType(Builder $query, string $employmentTypeId): void
    {
        $query->whereHas('employmentTypes', fn (Builder $assignment) => $assignment->where('employment_type_id', $employmentTypeId));
    }
}
