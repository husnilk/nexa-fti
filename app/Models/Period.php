<?php

namespace App\Models;

use Database\Factories\PeriodFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'year',
    'no',
    'name',
    'start_date',
    'end_date',
    'input_start_date',
    'input_end_date',
    'verification_start_date',
    'verification_end_date',
    'validation_start_date',
    'validation_end_date',
    'description',
    'attendance',
    'skp',
    'skp_format',
    'calc_method',
    'performance',
    'bkd_year',
    'bkd_semester',
    'p1_bkd_ref',
    'p1_bkd_year',
    'p1_bkd_semester',
    'p2_bkd_ref',
    'p2_bkd_year',
    'p2_bkd_semester',
    'status',
    'pir',
    'show_rupiah',
    'user_confirmation',
])]
class Period extends Model
{
    /** @use HasFactory<PeriodFactory> */
    use HasFactory, HasUuids;

    public const STATUS_INACTIVE = 0;

    public const STATUS_ACTIVE = 1;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'no' => 'integer',
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'input_start_date' => 'date:Y-m-d',
            'input_end_date' => 'date:Y-m-d',
            'verification_start_date' => 'date:Y-m-d',
            'verification_end_date' => 'date:Y-m-d',
            'validation_start_date' => 'date:Y-m-d',
            'validation_end_date' => 'date:Y-m-d',
            'attendance' => 'integer',
            'skp' => 'integer',
            'skp_format' => 'integer',
            'calc_method' => 'integer',
            'performance' => 'integer',
            'bkd_year' => 'integer',
            'p1_bkd_ref' => 'integer',
            'p1_bkd_year' => 'integer',
            'p2_bkd_ref' => 'integer',
            'p2_bkd_year' => 'integer',
            'status' => 'integer',
            'pir' => 'float',
            'show_rupiah' => 'integer',
            'user_confirmation' => 'integer',
        ];
    }

    /**
     * Only one period may be active: activating a period deactivates all others.
     */
    protected static function booted(): void
    {
        static::saved(function (Period $period) {
            if ($period->isActive() && ($period->wasRecentlyCreated || $period->wasChanged('status'))) {
                static::query()
                    ->whereKeyNot($period->getKey())
                    ->where('status', self::STATUS_ACTIVE)
                    ->update(['status' => self::STATUS_INACTIVE]);
            }
        });
    }

    /**
     * The currently active period, if any.
     */
    public static function active(): ?self
    {
        return static::query()
            ->where('status', self::STATUS_ACTIVE)
            ->orderByDesc('year')
            ->orderByDesc('no')
            ->first();
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function months(): HasMany
    {
        return $this->hasMany(PeriodMonth::class);
    }

    public function organizations(): HasMany
    {
        return $this->hasMany(PeriodOrganization::class);
    }
}
