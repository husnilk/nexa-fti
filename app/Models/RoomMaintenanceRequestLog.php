<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomMaintenanceRequestLog extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'room_maintenance_request_id',
        'log',
        'logged_by_id',
        'logged_at',
        'logged_file',
        'verified_by_id',
        'verified_at',
        'verification_file',
        'description',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'logged_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function roomMaintenanceRequest(): BelongsTo
    {
        return $this->belongsTo(RoomMaintenanceRequest::class);
    }

    public function loggedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'logged_by_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'verified_by_id');
    }

    public function roomMaintenanceRequestLogFiles(): HasMany
    {
        return $this->hasMany(RoomMaintenanceRequestLogFile::class);
    }
}
