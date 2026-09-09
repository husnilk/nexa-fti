<?php

use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentUsage;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();
    Employee::factory()->create(['id' => $this->user->id]);

    Permission::findOrCreate('equipment.borrow', 'web');
    Permission::findOrCreate('equipment.manage', 'web');

    $this->user->givePermissionTo('equipment.borrow');
});

test('user with equipment.borrow can view their own loan requests', function () {
    $equipment = Equipment::factory()->create(['status' => 'available']);
    $usage = EquipmentUsage::factory()->create([
        'borrower_id' => $this->user->id,
        'equipment_id' => $equipment->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->get(route('equipment-usages.index'))
        ->assertSuccessful()
        ->assertSee($usage->purpose);
});

test('user without equipment.borrow cannot view loan requests', function () {
    $this->user->revokePermissionTo('equipment.borrow');

    $this->actingAs($this->user)
        ->get(route('equipment-usages.index'))
        ->assertForbidden();
});

test('user with equipment.borrow can access create form', function () {
    $this->actingAs($this->user)
        ->get(route('equipment-usages.create'))
        ->assertSuccessful();
});

test('user with equipment.borrow can submit a loan request', function () {
    $this->withoutExceptionHandling();
    $equipment = Equipment::factory()->create(['status' => 'available']);

    $data = [
        'equipment_id' => $equipment->id,
        'planned_start_date' => now()->addDay()->format('Y-m-d H:i:s'),
        'planned_return_date' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'purpose' => 'Need for research project',
    ];

    $this->actingAs($this->user)
        ->postJson(route('equipment-usages.store'), $data)
        ->assertRedirect(route('equipment-usages.index'));

    $this->assertDatabaseHas('equipment_usages', [
        'equipment_id' => $equipment->id,
        'borrower_id' => $this->user->id,
        'purpose' => 'Need for research project',
        'status' => 'requested',
    ]);
});

test('user without equipment.borrow cannot submit a loan request', function () {
    $this->user->revokePermissionTo('equipment.borrow');
    $equipment = Equipment::factory()->create(['status' => 'available']);

    $data = [
        'equipment_id' => $equipment->id,
        'planned_start_date' => now()->addDay()->format('Y-m-d H:i:s'),
        'planned_return_date' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'purpose' => 'Need for research project',
    ];

    $this->actingAs($this->user)
        ->postJson(route('equipment-usages.store'), $data)
        ->assertForbidden();
});

test('user can only see their own loan requests', function () {
    $otherUser = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => 'available']);

    $myUsage = EquipmentUsage::factory()->create([
        'borrower_id' => $this->user->id,
        'equipment_id' => $equipment->id,
        'purpose' => 'My own request',
    ]);

    $otherUsage = EquipmentUsage::factory()->create([
        'borrower_id' => $otherUser->id,
        'equipment_id' => $equipment->id,
        'purpose' => 'Other users request',
    ]);

    $this->actingAs($this->user)
        ->get(route('equipment-usages.index'))
        ->assertSuccessful()
        ->assertSee($myUsage->purpose)
        ->assertDontSee($otherUsage->purpose);
});

test('admin with equipment.manage can see all loan requests', function () {
    $this->user->givePermissionTo('equipment.manage');

    $otherUser = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => 'available']);

    $otherUsage = EquipmentUsage::factory()->create([
        'borrower_id' => $otherUser->id,
        'equipment_id' => $equipment->id,
        'purpose' => 'Other users purpose',
    ]);

    $this->actingAs($this->user)
        ->get(route('equipment-usages.index'))
        ->assertSuccessful()
        ->assertSee($otherUsage->purpose);
});

test('user can delete their own pending loan request', function () {
    $equipment = Equipment::factory()->create(['status' => 'available']);
    $usage = EquipmentUsage::factory()->create([
        'borrower_id' => $this->user->id,
        'equipment_id' => $equipment->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->deleteJson(route('equipment-usages.destroy', $usage->id))
        ->assertRedirect(route('equipment-usages.index'));

    $this->assertDatabaseMissing('equipment_usages', ['id' => $usage->id]);
});

test('user cannot delete another users loan request', function () {
    $otherUser = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => 'available']);
    $usage = EquipmentUsage::factory()->create([
        'borrower_id' => $otherUser->id,
        'equipment_id' => $equipment->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->deleteJson(route('equipment-usages.destroy', $usage->id))
        ->assertForbidden();
});

test('user can view their own loan request detail', function () {
    $equipment = Equipment::factory()->create(['status' => 'available']);
    $usage = EquipmentUsage::factory()->create([
        'borrower_id' => $this->user->id,
        'equipment_id' => $equipment->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->get(route('equipment-usages.show', $usage->id))
        ->assertSuccessful();
});

test('user cannot view another users loan request', function () {
    $otherUser = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => 'available']);
    $usage = EquipmentUsage::factory()->create([
        'borrower_id' => $otherUser->id,
        'equipment_id' => $equipment->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->get(route('equipment-usages.show', $usage->id))
        ->assertForbidden();
});
