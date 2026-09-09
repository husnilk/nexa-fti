<?php

use App\Models\Employee;
use App\Models\InventoryRequest;
use App\Models\Item;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Setup roles & permissions
    Permission::findOrCreate('inventory.request', 'web');
    Permission::findOrCreate('inventory.approval', 'web');
    $superAdminRole = Role::findOrCreate('super-admin', 'web');

    // Super Admin
    $this->adminEmployee = Employee::factory()->create();
    $this->admin = User::find($this->adminEmployee->id);
    $this->admin->assignRole($superAdminRole);

    // Requester
    $this->requesterEmployee = Employee::factory()->create();
    $this->requester = User::find($this->requesterEmployee->id);
    $this->requester->givePermissionTo('inventory.request');

    // Approver
    $this->approverEmployee = Employee::factory()->create();
    $this->approver = User::find($this->approverEmployee->id);
    $this->approver->givePermissionTo('inventory.approval');

    // Unauthorized user
    $this->unauthorizedEmployee = Employee::factory()->create();
    $this->unauthorizedUser = User::find($this->unauthorizedEmployee->id);

    // Sibling objects
    $this->employee = Employee::factory()->create();
    $this->item = Item::factory()->create();
});

test('unauthorized user cannot access inventory request routes', function () {
    actingAs($this->unauthorizedUser)
        ->get(route('inventory-requests.index'))
        ->assertForbidden();

    actingAs($this->unauthorizedUser)
        ->get(route('inventory-requests.create'))
        ->assertForbidden();

    actingAs($this->unauthorizedUser)
        ->post(route('inventory-requests.store'), [])
        ->assertForbidden();
});

test('requester can view requests list', function () {
    InventoryRequest::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->requester)
        ->get(route('inventory-requests.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/requests/index')
            ->has('requests')
        );
});

test('requester can view create request form', function () {
    actingAs($this->requester)
        ->get(route('inventory-requests.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/requests/create')
            ->has('items')
            ->has('employees')
        );
});

test('requester can submit a new request', function () {
    $response = actingAs($this->requester)
        ->post(route('inventory-requests.store'), [
            'employee_id' => $this->employee->id,
            'items' => [
                [
                    'item_id' => $this->item->id,
                    'quantity' => 5,
                ],
            ],
        ]);

    $response->assertRedirect(route('inventory-requests.index'));

    assertDatabaseHas('inventory_requests', [
        'employee_id' => $this->employee->id,
        'status' => 'pending',
    ]);

    assertDatabaseHas('inventory_request_items', [
        'item_id' => $this->item->id,
        'quantity' => 5,
    ]);
});

test('requester can view request details', function () {
    $request = InventoryRequest::factory()->create([
        'employee_id' => $this->employee->id,
    ]);

    actingAs($this->requester)
        ->get(route('inventory-requests.show', $request))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/requests/show')
            ->has('inventoryRequest')
        );
});

test('unauthorized user cannot approve request', function () {
    $request = InventoryRequest::factory()->create([
        'employee_id' => $this->employee->id,
        'status' => 'pending',
    ]);

    actingAs($this->requester)
        ->post(route('inventory-requests.approve', $request), [
            'notes' => 'Approve comments',
        ])
        ->assertForbidden();
});

test('approver can approve request', function () {
    $request = InventoryRequest::factory()->create([
        'employee_id' => $this->employee->id,
        'status' => 'pending',
    ]);

    $response = actingAs($this->approver)
        ->post(route('inventory-requests.approve', $request), [
            'notes' => 'Approve comments',
        ]);

    $response->assertRedirect();

    assertDatabaseHas('inventory_requests', [
        'id' => $request->id,
        'status' => 'approved',
    ]);

    assertDatabaseHas('inventory_request_approvals', [
        'inventory_request_id' => $request->id,
        'status' => 'approved',
        'notes' => 'Approve comments',
    ]);
});

test('approver can reject request', function () {
    $request = InventoryRequest::factory()->create([
        'employee_id' => $this->employee->id,
        'status' => 'pending',
    ]);

    $response = actingAs($this->approver)
        ->post(route('inventory-requests.reject', $request), [
            'notes' => 'Reject reason comments',
        ]);

    $response->assertRedirect();

    assertDatabaseHas('inventory_requests', [
        'id' => $request->id,
        'status' => 'rejected',
    ]);

    assertDatabaseHas('inventory_request_approvals', [
        'inventory_request_id' => $request->id,
        'status' => 'rejected',
        'notes' => 'Reject reason comments',
    ]);
});
