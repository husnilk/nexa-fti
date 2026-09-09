<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeExpenseItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_expense_id',
        'committee_budget_item_id',
        'description',
        'quantity',
        'unit_price',
        'total_amount',
        'receipt_number',
        'receipt_file',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function committeeExpense(): BelongsTo
    {
        return $this->belongsTo(CommitteeExpense::class);
    }

    public function committeeBudgetItem(): BelongsTo
    {
        return $this->belongsTo(CommitteeBudgetItem::class);
    }
}
