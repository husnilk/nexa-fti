<?php

namespace App\Models;

use Database\Factories\EmploymentContractFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id', 'name', 'description'])]
class EmploymentContract extends Model
{
    /** @use HasFactory<EmploymentContractFactory> */
    use HasFactory;

    public function employmentTypes(): HasMany
    {
        return $this->hasMany(EmploymentType::class);
    }
}
