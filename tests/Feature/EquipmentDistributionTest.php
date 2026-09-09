<?php

use App\Models\Building;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use App\Models\EquipmentDistribution;
use App\Models\EquipmentModel;
use App\Models\Permission;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    Permission::findOrCreate('equipment.view', 'web');
    Permission::findOrCreate('equipment.manage', 'web');

    $this->adminEmployee = Employee::factory()->create();
    $this->admin = $this->adminEmployee->user;
    $this->admin->givePermissionTo(['equipment.view', 'equipment.manage']);

    $this->employee = Employee::factory()->create();
    $this->user = $this->employee->user;
    $this->user->givePermissionTo('equipment.view');

    $this->category = EquipmentCategory::factory()->create();
    $this->model = EquipmentModel::factory()->create(['equipment_category_id' => $this->category->id]);
    $this->equipment = Equipment::create([
        'equipment_model_id' => $this->model->id,
        'equipment_number' => 'EQ-001',
        'status' => 'available',
        'condition' => 'excellent',
    ]);

    $this->building = Building::factory()->create();
    $this->room = Room::factory()->create([
        'building_id' => $this->building->id,
        'responsible_employee_id' => $this->employee->id,
    ]);
});

test('admin can distribute equipment to employee', function () {
    $data = [
        'equipment_id' => $this->equipment->id,
        'employee_id' => $this->employee->id,
        'assigned_date' => now()->toDateString(),
        'status' => 'pending',
    ];

    actingAs($this->admin)
        ->postJson(route('equipment-distributions.store'), $data)
        ->assertRedirect(route('equipment-distributions.index'));

    $this->assertDatabaseHas('equipment_distributions', [
        'equipment_id' => $this->equipment->id,
        'employee_id' => $this->employee->id,
        'status' => 'pending',
    ]);
});

test('admin can distribute equipment to room', function () {
    $data = [
        'equipment_id' => $this->equipment->id,
        'room_id' => $this->room->id,
        'assigned_date' => now()->toDateString(),
        'status' => 'pending',
    ];

    actingAs($this->admin)
        ->postJson(route('equipment-distributions.store'), $data)
        ->assertRedirect(route('equipment-distributions.index'));

    $this->assertDatabaseHas('equipment_distributions', [
        'equipment_id' => $this->equipment->id,
        'room_id' => $this->room->id,
        'status' => 'pending',
    ]);
});

test('cannot distribute to both room and employee', function () {
    $data = [
        'equipment_id' => $this->equipment->id,
        'employee_id' => $this->employee->id,
        'room_id' => $this->room->id,
        'assigned_date' => now()->toDateString(),
        'status' => 'pending',
    ];

    actingAs($this->admin)
        ->postJson(route('equipment-distributions.store'), $data)
        ->assertSessionHasErrors(['employee_id', 'room_id']);
});

test('recipient can accept distribution', function () {
    $distribution = EquipmentDistribution::create([
        'equipment_id' => $this->equipment->id,
        'employee_id' => $this->user->id,
        'assigned_date' => now(),
        'status' => 'pending',
    ]);

    actingAs($this->user)
        ->postJson(route('equipment-distributions.accept', $distribution))
        ->assertRedirect();

    expect($distribution->refresh()->status)->toBe('accepted');
    expect($this->equipment->refresh()->status)->toBe('in_use');
});

test('room responsible can accept distribution to room', function () {
    $distribution = EquipmentDistribution::create([
        'equipment_id' => $this->equipment->id,
        'room_id' => $this->room->id,
        'assigned_date' => now(),
        'status' => 'pending',
    ]);

    actingAs($this->user)
        ->postJson(route('equipment-distributions.accept', $distribution))
        ->assertRedirect();

    expect($distribution->refresh()->status)->toBe('accepted');
});

test('unauthorized user cannot accept distribution', function () {
    $otherUser = User::factory()->create();
    $otherUser->givePermissionTo('equipment.view'); // Allow them to enter the module

    $distribution = EquipmentDistribution::create([
        'equipment_id' => $this->equipment->id,
        'employee_id' => $this->user->id,
        'assigned_date' => now(),
        'status' => 'pending',
    ]);

    actingAs($otherUser)
        ->postJson(route('equipment-distributions.accept', $distribution))
        ->assertRedirect(); // Should redirect back with error flash

    expect($distribution->refresh()->status)->toBe('pending');
});
