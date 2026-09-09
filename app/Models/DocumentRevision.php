<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentRevision extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'document_id',
        'revision_no',
        'revision_date',
        'doc_date',
        'doc_month',
        'doc_year',
        'active',
        'file_path',
        'uploaded_by',
        'uploaded_at',
        'uploaded_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'document_id' => 'string',
            'revision_date' => 'date',
            'active' => 'boolean',
            'uploaded_by' => 'string',
            'uploaded_at' => 'timestamp',
            'uploaded_by_id' => 'string',
        ];
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
