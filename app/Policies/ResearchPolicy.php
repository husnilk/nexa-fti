<?php

namespace App\Policies;

use App\Models\Research;
use App\Models\User;

class ResearchPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('research.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Research $research): bool
    {
        return $user->hasPermissionTo('research.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('research.manage');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Research $research): bool
    {
        return $user->hasPermissionTo('research.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Research $research): bool
    {
        return $user->hasPermissionTo('research.manage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Research $research): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Research $research): bool
    {
        return false;
    }
}
