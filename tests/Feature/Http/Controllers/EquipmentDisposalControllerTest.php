<?php

use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentDisposal;
use App\Models\EquipmentDisposalItem;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class, WithoutMiddleware::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->employee = Employee::factory()->create([
        'id' => $this->user->id,
        'email' => $this->user->email,
        'name' => $this->user->name,
    ]);
    Permission::findOrCreate('equipment.view', 'web');
    Permission::findOrCreate('equipment.disposal-view', 'web');
    Permission::findOrCreate('equipment.disposal-manage', 'web');
    $this->user->givePermissionTo(['equipment.view', 'equipment.disposal-view', 'equipment.disposal-manage']);
});

test('index displays view', function () {
    $equipmentDisposals = EquipmentDisposal::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->get(route('equipment-disposals.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('equipment/disposals/index')
    );
});

test('create displays view', function () {
    $response = $this->actingAs($this->user)
        ->get(route('equipment-disposals.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('equipment/disposals/create')
    );
});

test('store saves and redirects', function () {
    $equipment = Equipment::factory()->create();
    $disposal_number = 'DISP-'.fake()->unique()->word();
    $disposal_date = Carbon::parse(fake()->date());
    $title = fake()->sentence(4);
    $disposal_method = fake()->randomElement(['sold', 'donated', 'scrapped', 'lost', 'mutation']);
    $status = 'pending';

    $response = $this->actingAs($this->user)
        ->post(route('equipment-disposals.store'), [
            'disposal_number' => $disposal_number,
            'disposal_date' => $disposal_date->toDateString(),
            'title' => $title,
            'reason' => 'Damaged beyond repair',
            'disposal_method' => $disposal_method,
            'status' => $status,
            'proposed_by_id' => $this->employee->id,
            'items' => [
                [
                    'equipment_id' => $equipment->id,
                    'book_value' => 1500.00,
                    'disposal_value' => 200.00,
                    'notes' => 'Old monitor',
                ],
            ],
        ]);

    $response->dump();

    $response->assertRedirect(route('equipment-disposals.index'));

    $this->assertDatabaseHas('equipment_disposals', [
        'disposal_number' => $disposal_number,
        'title' => $title,
        'status' => $status,
        'proposed_by_id' => $this->employee->id,
    ]);

    $this->assertDatabaseHas('equipment_disposal_items', [
        'equipment_id' => $equipment->id,
        'book_value' => 1500.00,
        'disposal_value' => 200.00,
    ]);
});

test('show displays view', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create();

    $response = $this->actingAs($this->user)
        ->get(route('equipment-disposals.show', $equipmentDisposal));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('equipment/disposals/show')
    );
});

test('edit displays view for draft request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'draft']);

    $response = $this->actingAs($this->user)
        ->get(route('equipment-disposals.edit', $equipmentDisposal));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('equipment/disposals/edit')
    );
});

test('edit redirects with error for approved request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'approved']);

    $response = $this->actingAs($this->user)
        ->get(route('equipment-disposals.edit', $equipmentDisposal));

    $response->assertRedirect(route('equipment-disposals.index'));
    $response->assertSessionHas('error', 'Only draft or pending disposal requests can be edited.');
});

test('update redirects and updates for pending request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'pending']);
    $equipment = Equipment::factory()->create();
    $new_title = 'Updated Title';
    $disposal_method = fake()->randomElement(['sold', 'donated', 'scrapped', 'lost', 'mutation']);

    $response = $this->actingAs($this->user)
        ->put(route('equipment-disposals.update', $equipmentDisposal), [
            'disposal_number' => $equipmentDisposal->disposal_number,
            'disposal_date' => $equipmentDisposal->disposal_date->toDateString(),
            'title' => $new_title,
            'disposal_method' => $disposal_method,
            'status' => 'pending',
            'proposed_by_id' => $this->employee->id,
            'items' => [
                [
                    'equipment_id' => $equipment->id,
                    'book_value' => 800.00,
                    'disposal_value' => 50.00,
                    'notes' => 'Old keyboard',
                ],
            ],
        ]);

    $response->assertRedirect(route('equipment-disposals.index'));

    $equipmentDisposal->refresh();
    expect($equipmentDisposal->title)->toBe($new_title);
    expect($equipmentDisposal->equipmentDisposalItems)->toHaveCount(1);
    expect($equipmentDisposal->equipmentDisposalItems->first()->equipment_id)->toBe($equipment->id);
});

test('update redirects with error for approved request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'approved']);
    $equipment = Equipment::factory()->create();

    $response = $this->actingAs($this->user)
        ->put(route('equipment-disposals.update', $equipmentDisposal), [
            'disposal_number' => $equipmentDisposal->disposal_number,
            'disposal_date' => $equipmentDisposal->disposal_date->toDateString(),
            'title' => 'Some Title',
            'disposal_method' => 'scrapped',
            'status' => 'approved',
            'proposed_by_id' => $this->employee->id,
            'items' => [
                [
                    'equipment_id' => $equipment->id,
                ],
            ],
        ]);

    $response->assertRedirect(route('equipment-disposals.index'));
    $response->assertSessionHas('error', 'Only draft or pending disposal requests can be updated.');
});

test('destroy deletes and redirects for draft request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'draft']);
    $item = EquipmentDisposalItem::factory()->create(['equipment_disposal_id' => $equipmentDisposal->id]);

    $response = $this->actingAs($this->user)
        ->delete(route('equipment-disposals.destroy', $equipmentDisposal));

    $response->assertRedirect(route('equipment-disposals.index'));
    $this->assertModelMissing($equipmentDisposal);
    $this->assertModelMissing($item);
});

test('destroy redirects with error for approved request', function () {
    $equipmentDisposal = EquipmentDisposal::factory()->create(['status' => 'approved']);

    $response = $this->actingAs($this->user)
        ->delete(route('equipment-disposals.destroy', $equipmentDisposal));

    $response->assertRedirect(route('equipment-disposals.index'));
    $this->assertDatabaseHas('equipment_disposals', [
        'id' => $equipmentDisposal->id,
    ]);
    $response->assertSessionHas('error', 'Only draft or pending disposal requests can be cancelled.');
});

test('unauthorized user without equipment.disposal-view permission cannot access index', function () {
    $unauthorizedUser = User::factory()->create();
    Permission::findOrCreate('equipment.view', 'web');
    $unauthorizedUser->givePermissionTo('equipment.view');

    $response = $this->actingAs($unauthorizedUser)
        ->get(route('equipment-disposals.index'));

    $response->assertForbidden();
});
