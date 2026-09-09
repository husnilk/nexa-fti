<?php

namespace App\Models;

use Database\Factories\OrganizationPositionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationPosition extends Model
{
    /** @use HasFactory<OrganizationPositionFactory> */
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'position_id',
        'grade',
        'job_value',
        'cg',
        'is_active',
    ];

    protected $attributes = [
        'grade' => 0,
        'job_value' => 0,
        'cg' => 0,
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
