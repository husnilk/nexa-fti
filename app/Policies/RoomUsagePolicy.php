<?php

namespace App\Policies;

use App\Models\RoomUsage;
use App\Models\User;

class RoomUsagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['room.request', 'room.view', 'room.manage']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RoomUsage $roomUsage): bool
    {
        return ($user->id === $roomUsage->user_id && $user->hasPermissionTo('room.request'))
            || $user->hasAnyPermission(['room.view', 'room.manage']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['room.request', 'room.manage']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RoomUsage $roomUsage): bool
    {
        return ($user->id === $roomUsage->user_id && $roomUsage->status === 'requested' && $user->hasPermissionTo('room.request'))
            || $user->hasPermissionTo('room.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RoomUsage $roomUsage): bool
    {
        return ($user->id === $roomUsage->user_id && $roomUsage->status === 'requested' && $user->hasPermissionTo('room.request'))
            || $user->hasPermissionTo('room.manage');
    }

    /**
     * Determine whether the user can approve or reject the model.
     */
    public function approve(User $user): bool
    {
        return $user->hasPermissionTo('room.manage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RoomUsage $roomUsage): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RoomUsage $roomUsage): bool
    {
        return false;
    }
}
