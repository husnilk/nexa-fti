<?php

namespace App\Models;

use Database\Factories\RubricDetailFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'rubric_id',
    'position',
    'poin',
    'is_fixed_poin',
    'is_active',
])]
class RubricDetail extends Model
{
    /** @use HasFactory<RubricDetailFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'poin' => 'float',
            'is_fixed_poin' => 'integer',
            'is_active' => 'integer',
        ];
    }

    public function rubric(): BelongsTo
    {
        return $this->belongsTo(Rubric::class);
    }
}
