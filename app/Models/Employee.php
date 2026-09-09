<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'id', 'emp_number', 'id_card_number', 'tax_id_number', 'name', 'birth_place',
    'birth_date', 'gender', 'religion', 'marital_status', 'address', 'phone',
    'email', 'join_date', 'employment_type_id', 'supervisor_id', 'status',
])]
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory;

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Get the user that owns the employee.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id');
    }

    /**
     * Get the employment type.
     */
    public function employmentType(): BelongsTo
    {
        return $this->belongsTo(EmploymentType::class);
    }

    /**
     * Get the supervisor.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'supervisor_id');
    }

    /**
     * Get the subordinates.
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'supervisor_id');
    }

    /**
     * Get the lecturer specialization.
     */
    public function lecturer(): HasOne
    {
        return $this->hasOne(Lecturer::class, 'id');
    }

    /**
     * Get the staff specialization.
     */
    public function staff(): HasOne
    {
        return $this->hasOne(Staff::class, 'id');
    }

    /**
     * Get the position histories.
     */
    public function positionHistories(): HasMany
    {
        return $this->hasMany(EmployeePositionHistory::class)->latest('start_date');
    }

    /**
     * Get the education histories.
     */
    public function educationHistories(): HasMany
    {
        return $this->hasMany(EmployeeEducationHistory::class)->orderByDesc('end_year');
    }

    /**
     * Get the certifications.
     */
    public function certifications(): HasMany
    {
        return $this->hasMany(EmployeeCertification::class)->orderByDesc('issue_date');
    }

    /**
     * Get the trainings.
     */
    public function trainings(): BelongsToMany
    {
        return $this->belongsToMany(Training::class, 'employee_training')
            ->withTimestamps();
    }

    /**
     * Get the family members.
     */
    public function familyMembers(): HasMany
    {
        return $this->hasMany(EmployeeFamilyMember::class)->orderBy('relationship')->orderBy('name');
    }

    /**
     * Get the rank histories.
     */
    public function rankHistories(): HasMany
    {
        return $this->hasMany(EmployeeRankHistory::class)->latest('start_date');
    }

    /**
     * Get the attendance records.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(EmployeeAttendance::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'join_date' => 'date',
            'status' => 'integer',
        ];
    }
}
