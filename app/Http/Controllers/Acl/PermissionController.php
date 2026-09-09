<?php

namespace App\Http\Controllers\Acl;

use App\Http\Controllers\Controller;
use App\Http\Requests\Acl\StorePermissionRequest;
use App\Http\Requests\Acl\UpdatePermissionRequest;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('permissions/index', [
            'permissions' => Permission::query()
                ->select(['uuid', 'name', 'guard_name', 'category', 'description', 'created_at'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        Permission::create($request->validated());

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return to_route('permissions.index')->with('toast', [
            'type' => 'success',
            'message' => 'Permission created.',
        ]);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update($request->validated());

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return to_route('permissions.index')->with('toast', [
            'type' => 'success',
            'message' => 'Permission updated.',
        ]);
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        abort_unless(request()->user()?->can('account.manage'), 403);

        $permission->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return to_route('permissions.index')->with('toast', [
            'type' => 'success',
            'message' => 'Permission removed.',
        ]);
    }
}
