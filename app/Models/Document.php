<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'document_type_id',
        'organisation_id',
        'document_no',
        'publish_status',
        'published_by',
        'published_at',
        'archived_by',
        'archived_at',
        'published_by_id',
        'archived_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'document_type_id' => 'integer',
            'organisation_id' => 'string',
            'published_by' => 'string',
            'published_at' => 'timestamp',
            'archived_by' => 'string',
            'archived_at' => 'timestamp',
            'published_by_id' => 'string',
            'archived_by_id' => 'string',
        ];
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function archivedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organisation_id');
    }

    public function documentRevisions(): HasMany
    {
        return $this->hasMany(DocumentRevision::class);
    }
}
