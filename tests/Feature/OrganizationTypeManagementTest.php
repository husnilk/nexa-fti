<?php

use App\Models\OrganizationType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->orgManage = Permission::findOrCreate('organization.manage');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo($this->orgManage);
});

test('authorized user can view organization type list', function () {
    OrganizationType::factory()->create([
        'name' => 'Unit Khusus',
        'level' => 7,
    ]);

    actingAs($this->manager)
        ->get(route('organization-types.index', ['search' => 'Unit Khusus']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('organization-types/index')
            ->has('organizationTypes', 1)
            ->where('organizationTypes.0.name', 'Unit Khusus')
        );
});

test('authorized user can create organization type', function () {
    actingAs($this->manager)
        ->postJson(route('organization-types.store'), [
            'name' => 'Program Studi',
            'level' => 4,
        ])
        ->assertRedirect(route('organization-types.index'));

    $this->assertDatabaseHas('organization_types', [
        'name' => 'Program Studi',
        'level' => 4,
    ]);
});

test('authorized user can update organization type', function () {
    $organizationType = OrganizationType::factory()->create([
        'name' => 'Sub Unit',
        'level' => 6,
    ]);

    actingAs($this->manager)
        ->patchJson(route('organization-types.update', $organizationType), [
            'name' => 'Sub Bagian',
            'level' => 4,
        ])
        ->assertRedirect(route('organization-types.index'));

    $this->assertDatabaseHas('organization_types', [
        'id' => $organizationType->id,
        'name' => 'Sub Bagian',
        'level' => 4,
    ]);
});

test('authorized user can delete organization type', function () {
    $organizationType = OrganizationType::factory()->create([
        'name' => 'Temporary Type',
        'level' => 12,
    ]);

    actingAs($this->manager)
        ->deleteJson(route('organization-types.destroy', $organizationType))
        ->assertRedirect(route('organization-types.index'));

    $this->assertDatabaseMissing('organization_types', [
        'id' => $organizationType->id,
    ]);
});
