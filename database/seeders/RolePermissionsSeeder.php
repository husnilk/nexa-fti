<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $abilities = ['view', 'manage'];
        $modules = ['account', 'organizations', 'employment', 'hr', 'students', 'research', 'leave', 'overtime', 'community_service', 'publication', 'inventory', 'building', 'room', 'equipment', 'document', 'meeting', 'event', 'assignment', 'training', 'personal'];

        Permission::findOrCreate('maintenance.view', 'web');
        Permission::findOrCreate('maintenance.manage', 'web');
        Permission::findOrCreate('organization.view', 'web');
        Permission::findOrCreate('organization.manage', 'web');
        Permission::findOrCreate('equipment.disposal-view', 'web');
        Permission::findOrCreate('equipment.disposal-manage', 'web');
        Permission::findOrCreate('committee.view', 'web');
        Permission::findOrCreate('committee.manage', 'web');
        Permission::findOrCreate('leave.approval', 'web');
        Permission::findOrCreate('overtime.approval', 'web');
        Permission::findOrCreate('room.request', 'web');
        Permission::findOrCreate('room.approval', 'web');
        Permission::findOrCreate('certification.manage', 'web');
        Permission::findOrCreate('period.manage', 'web');
        Permission::findOrCreate('rubric.view', 'web');
        Permission::findOrCreate('rubric.manage', 'web');
        Permission::findOrCreate('attendance.view', 'web');
        Permission::findOrCreate('attendance.manage', 'web');
        Permission::findOrCreate('ept.view', 'web');
        Permission::findOrCreate('ept.manage', 'web');
        Permission::findOrCreate('activity.view', 'web');
        Permission::findOrCreate('activity.manage', 'web');
        Permission::findOrCreate('validator.manage', 'web');

        foreach ($modules as $module) {
            foreach ($abilities as $ability) {
                Permission::firstOrCreate(
                    ['name' => "$module.$ability", 'guard_name' => 'web'],
                    ['category' => $module, 'description' => "$ability $module"]
                );
            }
        }

        $inventorySpecific = ['request', 'approval', 'issue', 'procurement', 'receipt'];
        foreach ($inventorySpecific as $permission) {
            Permission::findOrCreate("inventory.$permission", 'web');
        }
    }
}
