<?php

namespace App\Models;

use Database\Factories\StudentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id', 'name', 'reg_no', 'reg_date', 'birth_place', 'birth_date', 'gender', 'religion',
    'email', 'campus_email', 'phone_no', 'home_address', 'home_town', 'home_province',
    'home_postalcode', 'current_address', 'current_town', 'current_province',
    'current_postalcode', 'department_id', 'year', 'status', 'advisor_id', 'photo',
])]
class Student extends Model
{
    /** @use HasFactory<StudentFactory> */
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
     * Get the user that owns the student.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id');
    }

    /**
     * Get the department (organization).
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'department_id');
    }

    /**
     * Get the advisor (lecturer).
     */
    public function advisor(): BelongsTo
    {
        return $this->belongsTo(Lecturer::class, 'advisor_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reg_date' => 'date',
            'birth_date' => 'date',
        ];
    }
}
