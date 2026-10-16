<?php

namespace App\Models;

use Database\Factories\RubricOrganizationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'rubric_id',
    'organization_id',
])]
class RubricOrganization extends Model
{
    /** @use HasFactory<RubricOrganizationFactory> */
    use HasFactory, HasUuids;

    public function rubric(): BelongsTo
    {
        return $this->belongsTo(Rubric::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
