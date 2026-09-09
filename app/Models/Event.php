<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'objectives',
        'event_type',
        'delivery_mode',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'venue',
        'online_platform',
        'online_link',
        'quota',
        'registration_deadline',
        'cover_image',
        'banner_image',
        'status',
        'created_by',
        'published_by',
        'published_at',
        'created_by_id',
        'published_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'registration_deadline' => 'datetime',
            'created_by' => 'string',
            'published_by' => 'string',
            'published_at' => 'timestamp',
            'created_by_id' => 'string',
            'published_by_id' => 'string',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function eventCommitteeMembers(): HasMany
    {
        return $this->hasMany(EventCommitteeMember::class);
    }

    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function eventReminders(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }

    public function eventAttendances(): HasMany
    {
        return $this->hasMany(EventAttendance::class);
    }

    public function eventCertificates(): HasMany
    {
        return $this->hasMany(EventCertificate::class);
    }

    public function eventDocuments(): HasMany
    {
        return $this->hasMany(EventDocument::class);
    }
}
