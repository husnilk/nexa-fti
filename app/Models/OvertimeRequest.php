<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OvertimeRequest extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'request_number',
        'title',
        'description',
        'request_date',
        'planned_start_time',
        'planned_end_time',
        'submitted_by',
        'approved_by',
        'status',
        'submitted_at',
        'approved_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'request_date' => 'date',
            'planned_start_time' => 'datetime',
            'planned_end_time' => 'datetime',
            'submitted_at' => 'timestamp',
            'approved_at' => 'timestamp',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    public function members(): HasMany
    {
        return $this->hasMany(OvertimeRequestMember::class);
    }

    public function approvalLogs(): HasMany
    {
        return $this->hasMany(OvertimeApprovalLog::class);
    }
}
