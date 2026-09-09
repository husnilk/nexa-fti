<?php

namespace App\Models;

use Database\Factories\PositionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'parent_id', 'grade', 'job_value', 'cg', 'skp_point', 'is_active', 'qualification', 'description'])]
class Position extends Model
{
    /** @use HasFactory<PositionFactory> */
    use HasFactory, HasUuids;

    protected $attributes = [
        'cg' => 0,
        'skp_point' => 0,
    ];

    /**
     * Get the parent position.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'parent_id');
    }

    /**
     * Get the child positions.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Position::class, 'parent_id');
    }

    /**
     * Get the responsibilities for the position.
     */
    public function responsibilities(): HasMany
    {
        return $this->hasMany(PositionResponsibility::class)->orderBy('order');
    }

    public function organizationPositions(): HasMany
    {
        return $this->hasMany(OrganizationPosition::class);
    }
}
