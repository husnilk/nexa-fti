<?php

use App\Models\EmployeeType;
use App\Models\EmploymentContract;
use App\Models\EmploymentType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin'));
});

test('authorized user can manage employee types', function () {
    // Create
    actingAs($this->admin)
        ->postJson(route('employee-types.store'), [
            'name' => 'Permanent',
            'description' => 'Full-time employee',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_types', ['name' => 'Permanent']);

    $type = EmployeeType::first();

    // Update
    actingAs($this->admin)
        ->patchJson(route('employee-types.update', $type), [
            'name' => 'Full-time',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employee_types', ['id' => $type->id, 'name' => 'Full-time']);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('employee-types.destroy', $type))
        ->assertRedirect();

    $this->assertDatabaseMissing('employee_types', ['id' => $type->id]);
});

test('authorized user can manage employment contracts', function () {
    // Create
    actingAs($this->admin)
        ->postJson(route('employment-contracts.store'), [
            'id' => 101,
            'name' => 'Fixed Term',
            'description' => '2 years contract',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employment_contracts', ['id' => 101, 'name' => 'Fixed Term']);

    $contract = EmploymentContract::find(101);

    // Update
    actingAs($this->admin)
        ->patchJson(route('employment-contracts.update', $contract), [
            'id' => 101,
            'name' => 'Contract A',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employment_contracts', ['id' => 101, 'name' => 'Contract A']);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('employment-contracts.destroy', $contract))
        ->assertRedirect();

    $this->assertDatabaseMissing('employment_contracts', ['id' => 101]);
});

test('authorized user can manage employment types', function () {
    $eType = EmployeeType::factory()->create();
    $contract = EmploymentContract::factory()->create();

    // Create
    actingAs($this->admin)
        ->postJson(route('employment-types.store'), [
            'employee_type_id' => $eType->id,
            'employment_contract_id' => $contract->id,
            'remun_status' => 'Standard',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employment_types', [
        'employee_type_id' => $eType->id,
        'employment_contract_id' => $contract->id,
        'remun_status' => 'Standard',
    ]);

    $empType = EmploymentType::first();

    // Update
    actingAs($this->admin)
        ->patchJson(route('employment-types.update', $empType), [
            'employee_type_id' => $eType->id,
            'employment_contract_id' => $contract->id,
            'remun_status' => 'High',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('employment_types', ['id' => $empType->id, 'remun_status' => 'High']);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('employment-types.destroy', $empType))
        ->assertRedirect();

    $this->assertDatabaseMissing('employment_types', ['id' => $empType->id]);
});
