<?php

namespace App\Models;

use Database\Factories\AttendanceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    /** @use HasFactory<AttendanceFactory> */
    use HasFactory, HasUuids;

    /**
     * Monthly day/occurrence counters entered on the attendance form.
     *
     * `employee_status` is intentionally excluded until its meaning is defined.
     *
     * @var list<string>
     */
    public const COUNT_FIELDS = [
        'present',
        'absent',
        'off_site_duty',
        'study_assignment',
        'sick_leave',
        'personal_leave',
        'long_service_leave',
        'maternity_leave',
        'unpaid_leave',
        'annual_leave',
        'special_leave',
        'late_01',
        'late_02',
        'late_03',
        'late_04',
        'late_05',
        'late_06',
        'early_departure_01',
        'early_departure_02',
        'early_departure_03',
        'early_departure_04',
        'early_departure_05',
        'early_departure_06',
        'maternity_leave_01',
        'maternity_leave_02',
        'maternity_leave_03',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'period_id',
        'employee_id',
        'year',
        'month',
        ...self::COUNT_FIELDS,
        'employee_status',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return array_merge(
            ['year' => 'integer', 'month' => 'integer', 'employee_status' => 'integer'],
            array_fill_keys(self::COUNT_FIELDS, 'integer'),
        );
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
