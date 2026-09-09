<?php

use App\Models\Organization;
use App\Models\OrganizationType;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->orgView = Permission::findOrCreate('organization.view');
    $this->orgManage = Permission::findOrCreate('organization.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo($this->orgView);

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo($this->orgManage);

    $this->rektoratType = OrganizationType::firstOrCreate(
        ['name' => 'Rektorat'],
        ['level' => 1],
    );
    $this->fakultasType = OrganizationType::firstOrCreate(
        ['name' => 'Fakultas'],
        ['level' => 2],
    );
    $this->bagianType = OrganizationType::firstOrCreate(
        ['name' => 'Bagian'],
        ['level' => 3],
    );
    $this->lembagaType = OrganizationType::firstOrCreate(
        ['name' => 'Lembaga'],
        ['level' => 2],
    );
    $this->uptType = OrganizationType::firstOrCreate(
        ['name' => 'UPT'],
        ['level' => 2],
    );
    $this->lainnyaType = OrganizationType::firstOrCreate(
        ['name' => 'Lainnya'],
        ['level' => 4],
    );
    $this->direktoratType = OrganizationType::firstOrCreate(
        ['name' => 'Direktorat'],
        ['level' => 2],
    );
});

test('authorized user can view organization list', function () {
    actingAs($this->viewer)
        ->get(route('organizations.index'))
        ->assertOk();
});

test('authorized user can create organization', function () {
    actingAs($this->manager)
        ->postJson(route('organizations.store'), [
            'organization_type_id' => $this->lainnyaType->id,
            'name' => 'Acme Corp',
            'code' => 'ACME',
            'is_active' => true,
            'description' => 'Test description',
        ])
        ->assertRedirect(route('organizations.index'));

    $this->assertDatabaseHas('organizations', [
        'name' => 'Acme Corp',
        'code' => 'ACME',
        'organization_type_id' => $this->lainnyaType->id,
        'is_active' => 1,
        'description' => 'Test description',
    ]);
});

test('authorized user can create child organization', function () {
    $parent = Organization::create([
        'organization_type_id' => $this->rektoratType->id,
        'name' => 'Parent Org',
        'code' => 'PARENT',
        'is_active' => true,
    ]);

    actingAs($this->manager)
        ->postJson(route('organizations.store'), [
            'parent_id' => $parent->id,
            'organization_type_id' => $this->bagianType->id,
            'name' => 'Child Org',
            'code' => 'CHILD',
            'is_active' => true,
        ])
        ->assertRedirect(route('organizations.index'));

    $this->assertDatabaseHas('organizations', [
        'parent_id' => $parent->id,
        'name' => 'Child Org',
        'code' => 'CHILD',
        'organization_type_id' => $this->bagianType->id,
    ]);
});

test('authorized user can update organization', function () {
    $org = Organization::create([
        'organization_type_id' => $this->uptType->id,
        'name' => 'Old Name',
        'code' => 'OLD',
        'is_active' => true,
    ]);

    actingAs($this->manager)
        ->patchJson(route('organizations.update', $org), [
            'organization_type_id' => $this->lembagaType->id,
            'name' => 'New Name',
            'code' => 'NEW',
            'is_active' => false,
            'description' => 'New description',
        ])
        ->assertRedirect(route('organizations.index'));

    $this->assertDatabaseHas('organizations', [
        'id' => $org->id,
        'name' => 'New Name',
        'code' => 'NEW',
        'organization_type_id' => $this->lembagaType->id,
        'is_active' => 0,
        'description' => 'New description',
    ]);
});

test('authorized user can delete organization', function () {
    $org = Organization::create([
        'organization_type_id' => $this->direktoratType->id,
        'name' => 'To Delete',
        'code' => 'DELETE',
        'is_active' => true,
    ]);

    actingAs($this->manager)
        ->deleteJson(route('organizations.destroy', $org))
        ->assertRedirect(route('organizations.index'));

    $this->assertDatabaseMissing('organizations', [
        'id' => $org->id,
    ]);
});

test('authorized user can search organizations', function () {
    Organization::create([
        'organization_type_id' => $this->lainnyaType->id,
        'name' => 'Specific Org',
        'code' => 'SPEC',
        'is_active' => true,
    ]);
    Organization::create([
        'organization_type_id' => $this->lainnyaType->id,
        'name' => 'Other Org',
        'code' => 'OTHER',
        'is_active' => true,
    ]);

    actingAs($this->viewer)
        ->get(route('organizations.index', ['search' => 'Specific']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('organizations', 1)
            ->where('organizations.0.name', 'Specific Org')
        );
});

test('authorized user can view organization detail', function () {
    $org = Organization::create([
        'organization_type_id' => $this->fakultasType->id,
        'name' => 'Detail Org',
        'code' => 'DETAIL',
        'is_active' => true,
        'description' => 'Detailed description',
    ]);

    actingAs($this->viewer)
        ->get(route('organizations.show', $org))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('organizations/show')
            ->has('organization')
            ->where('organization.name', 'Detail Org')
            ->where('organization.organization_type.name', 'Fakultas')
        );
});

test('authorized user can view organization structure', function () {
    Organization::create([
        'organization_type_id' => $this->fakultasType->id,
        'name' => 'Structure Org',
        'code' => 'STRUCT',
        'is_active' => true,
    ]);

    actingAs($this->viewer)
        ->get(route('organizations.structure'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('organizations/structure')
            ->has('organizations', 1)
            ->where('organizations.0.name', 'Structure Org')
            ->where('organizations.0.organization_type.name', 'Fakultas')
        );
});
