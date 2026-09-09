<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'name',
        'objective',
        'expected_outcome',
        'start_date',
        'end_date',
        'status',
        'chairman_id',
        'organization_id',
        'description',
        'chairman_id_id',
        'sponsor_unit_id_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'chairman_id_id' => 'string',
            'sponsor_unit_id_id' => 'string',
        ];
    }

    public function chairman(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function sponsorUnit(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function committeeMembers(): HasMany
    {
        return $this->hasMany(CommitteeMember::class);
    }

    public function committeeTasks(): HasMany
    {
        return $this->hasMany(CommitteeTask::class);
    }

    public function committeeBudgets(): HasMany
    {
        return $this->hasMany(CommitteeBudget::class);
    }

    public function committeeExpenses(): HasMany
    {
        return $this->hasMany(CommitteeExpense::class);
    }

    public function committeeDocuments(): HasMany
    {
        return $this->hasMany(CommitteeDocument::class);
    }
}
