<?php

namespace App\Policies;

use App\Models\RoomMaintenanceRequest;
use App\Models\User;

class RoomMaintenanceRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return $user->id === $roomMaintenanceRequest->reported_by_id || $user->hasPermissionTo('maintenance.view') || $user->hasPermissionTo('room.approval');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return ($user->id === $roomMaintenanceRequest->reported_by_id && $roomMaintenanceRequest->status === 'reported') || $user->hasPermissionTo('maintenance.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return ($user->id === $roomMaintenanceRequest->reported_by_id && $roomMaintenanceRequest->status === 'reported') || $user->hasPermissionTo('maintenance.manage');
    }

    /**
     * Determine whether the user can respond to the request.
     */
    public function respond(User $user): bool
    {
        return $user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('room.approval');
    }

    /**
     * Determine whether the user can add logs (fix) to the request.
     */
    public function addLog(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return ($user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('room.approval')) && in_array($roomMaintenanceRequest->status, ['accepted', 'in_progress']);
    }

    /**
     * Determine whether the user can verify the request.
     */
    public function verify(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return $user->id === $roomMaintenanceRequest->reported_by_id && $roomMaintenanceRequest->status === 'resolved';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RoomMaintenanceRequest $roomMaintenanceRequest): bool
    {
        return false;
    }
}
