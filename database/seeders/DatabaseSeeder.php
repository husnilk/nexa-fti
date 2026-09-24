<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionsSeeder::class,
            OrganizationTypeSeeder::class,
            OrganizationSeeder::class,
            PositionSeeder::class,
            ResponsibilitySeeder::class,
            PositionNomenclatureSeeder::class,
            PositionNomenclatureClassificationSeeder::class,
            PositionNomenclatureResponsibilitySeeder::class,
            FunctionalPositionSeeder::class,
            EmployeeRankSeeder::class,
            EmployeeTypeSeeder::class,
            EmploymentContractSeeder::class,
            EmploymentTypeSeeder::class,
            EmployeeSeeder::class,
            LecturerSeeder::class,
            StaffSeeder::class,
            EmployeeRankHistorySeeder::class,
            EmployeeCertificationSeeder::class,
            TrainingSeeder::class,
            StudentSeeder::class,
            EmployeeAttendanceSeeder::class,
            ResearchSeeder::class,
            CommunityServiceSeeder::class,
            PublicationSeeder::class,
            LeaveTypeSeeder::class,
            InventorySeeder::class,
            InventoryItemSeeder::class,
            EquipmentCategorySeeder::class,
            BookSeeder::class,
            RoomSeeder::class,
        ]);

        $viewDashboard = Permission::findOrCreate('dashboard.view', 'web');
        $userRole = Role::findOrCreate('user', 'web');
        $userRole->givePermissionTo($viewDashboard);

        $superAdminRole = Role::findOrCreate('super-admin', 'web');
        $superAdminRole->givePermissionTo(Permission::all());

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $user->assignRole($superAdminRole);
    }
}
