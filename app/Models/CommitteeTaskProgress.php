<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeTaskProgress extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_task_id',
        'progress_date',
        'progress_percentage',
        'description',
        'attachment',
        'created_by',
        'created_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'progress_date' => 'datetime',
            'progress_percentage' => 'decimal:2',
            'created_by_id' => 'string',
        ];
    }

    public function committeeTask(): BelongsTo
    {
        return $this->belongsTo(CommitteeTask::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
