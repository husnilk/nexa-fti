<?php

namespace App\Models;

use Database\Factories\RubricEmploymentTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'rubric_id',
    'employment_type_id',
])]
class RubricEmploymentType extends Model
{
    /** @use HasFactory<RubricEmploymentTypeFactory> */
    use HasFactory, HasUuids;

    public function rubric(): BelongsTo
    {
        return $this->belongsTo(Rubric::class);
    }

    public function employmentType(): BelongsTo
    {
        return $this->belongsTo(EmploymentType::class);
    }
}
