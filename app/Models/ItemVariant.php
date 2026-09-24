<?php

namespace App\Models;

use Database\Factories\ItemVariantFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemVariant extends Model
{
    /** @use HasFactory<ItemVariantFactory> */
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'item_id',
        'name',
    ];

    /**
     * Get the item that owns the variant.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
