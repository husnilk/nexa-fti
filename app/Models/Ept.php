<?php

namespace App\Models;

use Database\Factories\EptFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Employee Performance Target (Sasaran Kinerja Pegawai).
 */
class Ept extends Model
{
    /** @use HasFactory<EptFactory> */
    use HasFactory, HasUuids;

    public const STATUS_DRAFT = 0;

    public const STATUS_SUBMITTED = 1;

    public const STATUS_VERIFIED = 2;

    /**
     * Behaviour aspects, each scored 0–100.
     *
     * @var list<string>
     */
    public const BEHAVIOR_ASPECTS = [
        'orientation',
        'integrity',
        'commitment',
        'discipline',
        'teamwork',
        'leadership',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'year',
        'period_id',
        'start',
        'end',
        'start_date',
        'end_date',
        'appraiser_officer_id',
        'superior_appraiser_officer_id',
        ...self::BEHAVIOR_ASPECTS,
        'objection',
        'objection_date',
        'response',
        'response_date',
        'decision',
        'decision_date',
        'recommendation',
        'recorded_date',
        'received_date',
        'superior_received_date',
        'status',
        'verified_at',
        'skp_achievement',
        'performance_predicate',
        'behavior_rating',
        'work_result_rating',
        'evidence_file',
        'created_by',
        'updated_by',
        'verified_by',
        'points',
        'verification_points',
        'contract_file',
        'violation_level',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'start' => 'integer',
            'end' => 'integer',
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'orientation' => 'integer',
            'integrity' => 'integer',
            'commitment' => 'integer',
            'discipline' => 'integer',
            'teamwork' => 'integer',
            'leadership' => 'integer',
            'objection_date' => 'date:Y-m-d',
            'response_date' => 'date:Y-m-d',
            'decision_date' => 'date:Y-m-d',
            'recorded_date' => 'date:Y-m-d',
            'received_date' => 'date:Y-m-d',
            'superior_received_date' => 'date:Y-m-d',
            'status' => 'integer',
            'verified_at' => 'datetime',
            'skp_achievement' => 'float',
            'performance_predicate' => 'integer',
            'behavior_rating' => 'integer',
            'work_result_rating' => 'integer',
            'points' => 'integer',
            'verification_points' => 'integer',
            'violation_level' => 'integer',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function appraiser(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'appraiser_officer_id');
    }

    public function superiorAppraiser(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'superior_appraiser_officer_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
