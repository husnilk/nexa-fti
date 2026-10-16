<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'period_id',
    'organization_id',
    'pagu',
    'pir_unit',
    'sharing_method',
    'finalization_state',
    'stage',
    'percentage',
])]
class PeriodOrganization extends Model
{
    use HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pagu' => 'float',
            'pir_unit' => 'float',
            'sharing_method' => 'integer',
            'finalization_state' => 'integer',
            'stage' => 'integer',
            'percentage' => 'float',
        ];
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Limit to rows whose organization is flagged as holding a budget (pagu).
     *
     * @param  Builder<PeriodOrganization>  $query
     */
    public function scopeWithPagu(Builder $query): void
    {
        $query->whereHas('organization', fn (Builder $organization) => $organization->where('has_pagu', true));
    }
}
