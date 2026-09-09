<?php

namespace App\Models;

use Database\Factories\EmploymentTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['employee_type_id', 'employment_contract_id', 'remun_status'])]
class EmploymentType extends Model
{
    /** @use HasFactory<EmploymentTypeFactory> */
    use HasFactory, HasUuids;

    public function employeeType(): BelongsTo
    {
        return $this->belongsTo(EmployeeType::class);
    }

    public function employmentContract(): BelongsTo
    {
        return $this->belongsTo(EmploymentContract::class);
    }
}
