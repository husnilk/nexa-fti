<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommitteeTask extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_id',
        'parent_id',
        'title',
        'description',
        'assigned_to',
        'start_date',
        'due_date',
        'priority',
        'status',
        'completion_percentage',
        'parent_id_id',
        'assigned_to_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'completion_percentage' => 'decimal:2',
            'parent_id_id' => 'string',
            'assigned_to_id' => 'string',
        ];
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(CommitteeTask::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(CommitteeMember::class);
    }

    public function committeeTaskProgresses(): HasMany
    {
        return $this->hasMany(CommitteeTaskProgress::class);
    }

    public function parents(): HasMany
    {
        return $this->hasMany(CommitteeTask::class);
    }
}
