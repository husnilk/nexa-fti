<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'assigned_by',
        'assigned_to',
        'parent_id',
        'start_date',
        'due_date',
        'status',
        'priority',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'assigned_by' => 'string',
            'assigned_to' => 'string',
            'parent_id' => 'integer',
            'start_date' => 'date',
            'due_date' => 'date',
        ];
    }

    /** @return BelongsTo<Employee, $this> */
    public function assignedByEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_by');
    }

    /** @return BelongsTo<Employee, $this> */
    public function assignedToEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    /** @return BelongsTo<Assignment, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Assignment::class, 'parent_id');
    }

    /** @return HasMany<Assignment, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(Assignment::class, 'parent_id');
    }

    /** @return HasMany<AssignmentProgress, $this> */
    public function progresses(): HasMany
    {
        return $this->hasMany(AssignmentProgress::class);
    }
}
