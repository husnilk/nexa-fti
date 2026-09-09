<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meeting extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'committee_id',
        'title',
        'agenda',
        'meeting_type',
        'meeting_date',
        'start_time',
        'end_time',
        'room_id',
        'online_platform',
        'online_link',
        'organizer_id',
        'chairman_id',
        'status',
        'is_confidential',
        'organizer_id_id',
        'chairman_id_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meeting_date' => 'date',
            'room_id' => 'integer',
            'is_confidential' => 'boolean',
            'organizer_id_id' => 'string',
            'chairman_id_id' => 'string',
        ];
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function chairman(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function meetingParticipants(): HasMany
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function meetingExternalParticipants(): HasMany
    {
        return $this->hasMany(MeetingExternalParticipant::class);
    }

    public function meetingMinutes(): HasMany
    {
        return $this->hasMany(MeetingMinute::class);
    }

    public function meetingDocuments(): HasMany
    {
        return $this->hasMany(MeetingDocument::class);
    }

    public function meetingRefreshmentRequests(): HasMany
    {
        return $this->hasMany(MeetingRefreshmentRequest::class);
    }

    public function meetingActionItems(): HasMany
    {
        return $this->hasMany(MeetingActionItem::class);
    }
}
