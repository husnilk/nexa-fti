<?php

namespace App\Models;

use Database\Factories\ActivityFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    /** @use HasFactory<ActivityFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'period_id',
        'rubric_id',
        'name',
        'organization_id',
        'document_number',
        'form_type',
        'evidence_file',
        'evidence_link',
        'shared_performance_evidence',
        'performance_evidence_link',
        'performance_evidence_file',
        'validator_id',
        'verifier_id',
        'created_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'form_type' => 'integer',
            'shared_performance_evidence' => 'boolean',
        ];
    }

    public function scopeInActivePeriod(Builder $query): void
    {
        $query->whereIn('period_id', Period::query()->where('status', Period::STATUS_ACTIVE)->select('id'));
    }

    public function isInActivePeriod(): bool
    {
        return static::query()->whereKey($this->getKey())->inActivePeriod()->exists();
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function rubric(): BelongsTo
    {
        return $this->belongsTo(Rubric::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function performances(): HasMany
    {
        return $this->hasMany(Performance::class);
    }
}
