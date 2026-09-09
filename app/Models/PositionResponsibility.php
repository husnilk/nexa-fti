<?php

namespace App\Models;

use Database\Factories\PositionResponsibilityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['position_id', 'title', 'description', 'type', 'order'])]
class PositionResponsibility extends Model
{
    /** @use HasFactory<PositionResponsibilityFactory> */
    use HasFactory, HasUuids;

    protected $table = 'position_responsibilities';

    /**
     * Get the position that owns the responsibility.
     */
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
