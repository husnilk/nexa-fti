<?php

namespace App\Models;

use Database\Factories\EmployeeRankHistoryFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeRankHistory extends Model
{
    /** @use HasFactory<EmployeeRankHistoryFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'employee_id',
        'employee_rank_id',
        'start_date',
        'end_date',
        'effective_date',
        'decree_number',
        'decree_date',
        'decree_file',
        'remarks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'effective_date' => 'date',
        'decree_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function rank(): BelongsTo
    {
        return $this->belongsTo(EmployeeRank::class, 'employee_rank_id');
    }
}
