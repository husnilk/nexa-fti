<?php

namespace App\Policies;

use App\Models\EquipmentMaintenanceRequest;
use App\Models\User;

class EquipmentMaintenanceRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('equipment.view') || $user->hasPermissionTo('equipment.maintenance-request');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EquipmentMaintenanceRequest $request): bool
    {
        return $user->id === $request->reported_by_id || $user->hasPermissionTo('maintenance.view') || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('equipment.maintenance-request') || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EquipmentMaintenanceRequest $request): bool
    {
        return ($user->id === $request->reported_by_id && $request->status === 'open') || $user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EquipmentMaintenanceRequest $request): bool
    {
        return ($user->id === $request->reported_by_id && $request->status === 'open') || $user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can respond to the request.
     */
    public function respond(User $user): bool
    {
        return $user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can add activities to the request.
     */
    public function addActivity(User $user, EquipmentMaintenanceRequest $request): bool
    {
        return ($user->hasPermissionTo('maintenance.manage') || $user->hasPermissionTo('equipment.manage')) && in_array($request->status, ['in_progress']);
    }

    /**
     * Determine whether the user can verify the request.
     */
    public function verify(User $user, EquipmentMaintenanceRequest $request): bool
    {
        return $user->id === $request->reported_by_id && $request->status === 'resolved';
    }
}
