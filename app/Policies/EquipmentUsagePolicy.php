<?php

namespace App\Policies;

use App\Models\EquipmentUsage;
use App\Models\User;

class EquipmentUsagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['equipment.borrow', 'equipment.manage']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EquipmentUsage $equipmentUsage): bool
    {
        return ($user->id === $equipmentUsage->borrower_id && $user->hasPermissionTo('equipment.borrow'))
            || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['equipment.borrow', 'equipment.manage']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EquipmentUsage $equipmentUsage): bool
    {
        return ($user->id === $equipmentUsage->borrower_id
            && $equipmentUsage->status === 'requested'
            && $user->hasPermissionTo('equipment.borrow'))
            || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EquipmentUsage $equipmentUsage): bool
    {
        return ($user->id === $equipmentUsage->borrower_id
            && in_array($equipmentUsage->status, ['requested', 'rejected'])
            && $user->hasPermissionTo('equipment.borrow'))
            || $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can approve/reject the model.
     */
    public function approve(User $user): bool
    {
        return $user->hasPermissionTo('equipment.manage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EquipmentUsage $equipmentUsage): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EquipmentUsage $equipmentUsage): bool
    {
        return false;
    }
}
