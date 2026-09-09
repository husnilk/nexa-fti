<?php

use App\Models\Asset;
use App\Models\Building;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

uses(RefreshDatabase::class);
// uses(WithoutMiddleware::class); // I'll use it selectively if needed or globally for this test

beforeEach(function () {
    $this->user = User::factory()->create();

    // Create permissions
    Permission::findOrCreate('building.view', 'web');
    Permission::findOrCreate('building.manage', 'web');
    Permission::findOrCreate('building.manage', 'web');
    Permission::findOrCreate('building.manage', 'web');
    Permission::findOrCreate('room.view', 'web');
    Permission::findOrCreate('room.manage', 'web');
    Permission::findOrCreate('room.manage', 'web');
    Permission::findOrCreate('room.manage', 'web');

    $this->user->givePermissionTo([
        'building.view', 'building.manage', 'building.manage', 'building.manage',
        'room.view', 'room.manage', 'room.manage', 'room.manage',
    ]);
});

test('can view buildings index', function () {
    $this->actingAs($this->user)
        ->get(route('buildings.index'))
        ->assertSuccessful();
});

test('can create building', function () {
    $data = [
        'name' => 'Main Building',
        'code' => 'MB-01',
        'description' => 'Test description',
    ];

    $this->withoutMiddleware();

    $this->actingAs($this->user)
        ->postJson(route('buildings.store'), $data)
        ->assertRedirect(route('buildings.index'));

    $this->assertDatabaseHas('buildings', $data);
});

test('can view rooms index', function () {
    $this->actingAs($this->user)
        ->get(route('rooms.index'))
        ->assertSuccessful();
});

test('can create room with asset', function () {
    $building = Building::factory()->create();
    $employee = Employee::factory()->create();

    $data = [
        // Asset fields
        'asset_name' => 'Room 101 Asset',
        'asset_code' => 'AST-R101',
        'acquisition_type' => 'procurement',
        'acquisition_date' => now()->format('Y-m-d'),
        'acquisition_cost' => 1000,
        'condition' => 'good',
        'status' => 'available',

        // Room fields
        'building_id' => $building->id,
        'name' => 'Room 101',
        'code' => 'R-101',
        'floor' => '1st',
        'capacity' => 30,
        'is_public' => true,
        'responsible_employee_id' => $employee->id,
    ];

    $this->withoutMiddleware();

    $this->actingAs($this->user)
        ->postJson(route('rooms.store'), $data)
        ->assertRedirect(route('rooms.index'));

    $this->assertDatabaseHas('assets', [
        'name' => 'Room 101 Asset',
        'code' => 'AST-R101',
        'type' => 'room',
    ]);

    $asset = Asset::where('code', 'AST-R101')->first();

    $this->assertDatabaseHas('rooms', [
        'id' => $asset->id,
        'name' => 'Room 101',
        'code' => 'R-101',
        'building_id' => $building->id,
    ]);
});

test('can view room detail', function () {
    $building = Building::factory()->create();
    $employee = Employee::factory()->create();
    $room = Room::factory()->create([
        'building_id' => $building->id,
        'responsible_employee_id' => $employee->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('rooms.show', $room->id))
        ->assertSuccessful();
});

test('user without room permission cannot access rooms', function () {
    $unauthorizedUser = User::factory()->create();

    $this->actingAs($unauthorizedUser)
        ->get(route('rooms.index'))
        ->assertForbidden();
});
