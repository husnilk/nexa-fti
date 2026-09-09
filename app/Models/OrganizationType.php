<?php

namespace App\Models;

use Database\Factories\OrganizationTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'level'])]
class OrganizationType extends Model
{
    /** @use HasFactory<OrganizationTypeFactory> */
    use HasFactory, HasUuids;

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

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}
