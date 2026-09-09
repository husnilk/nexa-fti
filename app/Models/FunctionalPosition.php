<?php

namespace App\Models;

use Database\Factories\FunctionalPositionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'code', 'description', 'level', 'grade', 'job_value', 'is_active'])]
class FunctionalPosition extends Model
{
    /** @use HasFactory<FunctionalPositionFactory> */
    use HasFactory, HasUuids;

    protected $attributes = [
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
