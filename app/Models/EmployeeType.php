<?php

namespace App\Models;

use Database\Factories\EmployeeTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description'])]
class EmployeeType extends Model
{
    /** @use HasFactory<EmployeeTypeFactory> */
    use HasFactory, HasUuids;

    public function employmentTypes(): HasMany
    {
        return $this->hasMany(EmploymentType::class);
    }
}
