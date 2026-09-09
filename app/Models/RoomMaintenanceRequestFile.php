<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomMaintenanceRequestFile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'room_maintenance_request_id',
        'file',
        'description',
    ];

    public function roomMaintenanceRequest(): BelongsTo
    {
        return $this->belongsTo(RoomMaintenanceRequest::class);
    }
}
