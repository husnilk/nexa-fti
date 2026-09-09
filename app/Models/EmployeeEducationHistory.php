<?php

namespace App\Models;

use Database\Factories\EmployeeEducationHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['employee_id', 'degree', 'institution', 'major', 'start_year', 'end_year', 'gpa', 'certificate_file'])]
class EmployeeEducationHistory extends Model
{
    /** @use HasFactory<EmployeeEducationHistoryFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the employee.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_year' => 'integer',
            'end_year' => 'integer',
            'gpa' => 'decimal:2',
        ];
    }
}
