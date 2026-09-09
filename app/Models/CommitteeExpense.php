<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommitteeExpense extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_id',
        'expense_number',
        'expense_date',
        'submitted_by',
        'description',
        'status',
        'approved_by',
        'approved_at',
        'submitted_by_id',
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
            'expense_date' => 'date',
            'approved_at' => 'timestamp',
            'submitted_by_id' => 'string',
            'approved_by_id' => 'string',
        ];
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function committeeExpenseItems(): HasMany
    {
        return $this->hasMany(CommitteeExpenseItem::class);
    }
}
