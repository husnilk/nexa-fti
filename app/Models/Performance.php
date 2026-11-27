<?php

namespace App\Models;

use Database\Factories\PerformanceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * An employee's involvement in an activity, scored by a rubric position.
 */
class Performance extends Model
{
    /** @use HasFactory<PerformanceFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    public const VERIFICATION_PENDING = 0;

    public const VERIFICATION_APPROVED = 1;

    public const VERIFICATION_REJECTED = 2;

    public const VERIFICATION_RETURNED = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'activity_id',
        'rubric_detail_id',
        'period_id',
        'name',
        'quantity',
        'remuneration_amount',
        'excess_amount',
        'original_amount',
        'validation_amount',
        'change_reason',
        'points',
        'letter_number',
        'letter_date',
        'start_date',
        'expiration_date',
        'document_type',
        'evidence_file',
        'evidence_link',
        'verification_reason_code',
        'verification_status',
        'verifier_id',
        'verification_reason',
        'validation_status',
        'validator_id',
        'validation_reason_code',
        'validation_reason',
        'position',
        'is_modified',
        'operator_id',
        'is_final',
        'percentage',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'float',
            'points' => 'float',
            'remuneration_amount' => 'float',
            'excess_amount' => 'float',
            'original_amount' => 'float',
            'validation_amount' => 'float',
            'percentage' => 'float',
            'verification_status' => 'integer',
            'letter_date' => 'date:Y-m-d',
            'start_date' => 'date:Y-m-d',
            'expiration_date' => 'date:Y-m-d',
        ];
    }

    /**
     * Performances the given user may verify: everything in activities they verify
     * except their own, plus the own performance of verifiers they supervise.
     * Only activities in the active period can be verified.
     */
    public function scopeVerifiableBy(Builder $query, string $userId): void
    {
        $query->whereHas('activity', fn (Builder $q) => $q->inActivePeriod());

        $query->where(function (Builder $query) use ($userId) {
            $query->where(function (Builder $query) use ($userId) {
                $query->whereHas('activity', fn (Builder $q) => $q->where('verifier_id', $userId))
                    ->where('employee_id', '!=', $userId);
            })->orWhere(function (Builder $query) use ($userId) {
                $query->whereHas('activity', fn (Builder $q) => $q->whereColumn('activities.verifier_id', 'performances.employee_id'))
                    ->whereHas('employee', fn (Builder $q) => $q->where('supervisor_id', $userId));
            });
        });
    }

    public function canBeVerifiedBy(User $user): bool
    {
        return static::query()->whereKey($this->getKey())->verifiableBy($user->id)->exists();
    }

    /**
     * Approved and rejected performances can no longer be edited by operators.
     */
    public function isLocked(): bool
    {
        return in_array($this->verification_status, [self::VERIFICATION_APPROVED, self::VERIFICATION_REJECTED], true);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function rubricDetail(): BelongsTo
    {
        return $this->belongsTo(RubricDetail::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
