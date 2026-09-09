<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventAttendance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'event_registration_id',
        'checked_in_at',
        'checked_out_at',
        'checked_by',
        'attendance_method',
        'status',
        'event_id',
        'checked_by_id',
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
            'event_registration_id' => 'integer',
            'checked_in_at' => 'timestamp',
            'checked_out_at' => 'timestamp',
            'checked_by' => 'string',
            'event_id' => 'integer',
            'checked_by_id' => 'string',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function eventRegistration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class);
    }

    public function checkedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
