<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Asset extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'code',
        'type',
        'acquisition_type',
        'acquisition_date',
        'acquisition_cost',
        'asset_grant_id',
        'condition',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'acquisition_cost' => 'decimal:2',
            'asset_grant_id' => 'integer',
        ];
    }

    public function room(): HasOne
    {
        return $this->hasOne(Room::class);
    }

    public function assetGrant(): BelongsTo
    {
        return $this->belongsTo(AssetGrant::class);
    }
}
