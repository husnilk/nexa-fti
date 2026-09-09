<?php

namespace App\Models;

use Database\Factories\EmployeeRankFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeRank extends Model
{
    /** @use HasFactory<EmployeeRankFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'code',
        'name',
        'order',
        'description',
    ];

    public function histories(): HasMany
    {
        return $this->hasMany(EmployeeRankHistory::class, 'employee_rank_id');
    }
}
