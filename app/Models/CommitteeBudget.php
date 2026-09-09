<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommitteeBudget extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_id',
        'budget_number',
        'title',
        'prepared_by',
        'prepared_at',
        'status',
        'approved_by',
        'approved_at',
        'prepared_by_id',
        'approved_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'prepared_at' => 'date',
            'approved_at' => 'timestamp',
            'prepared_by_id' => 'string',
            'approved_by_id' => 'string',
        ];
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function preparedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function committeeBudgetItems(): HasMany
    {
        return $this->hasMany(CommitteeBudgetItem::class);
    }
}
