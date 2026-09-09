<?php

use App\Models\Organization;
use App\Models\OrganizationPosition;
use App\Models\OrganizationType;
use App\Models\Permission;
use App\Models\Position;
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

    $this->organizationType = OrganizationType::firstOrCreate(
        ['name' => 'Lainnya'],
        ['level' => 4],
    );

    $this->organization = Organization::create([
        'organization_type_id' => $this->organizationType->id,
        'name' => 'Detail Organization',
        'code' => 'DETAIL-ORG',
        'is_active' => true,
    ]);

    $this->position = Position::factory()->create([
        'name' => 'Head of Unit',
        'grade' => 9,
        'job_value' => 350,
        'cg' => 4,
        'is_active' => 1,
    ]);
});

test('authorized user can add position to organization', function () {
    actingAs($this->manager)
        ->postJson(route('organization-positions.store'), [
            'organization_id' => $this->organization->id,
            'position_id' => $this->position->id,
            'grade' => 10,
            'job_value' => 400,
            'cg' => 5,
            'is_active' => true,
        ])
        ->assertRedirect(route('organizations.show', $this->organization));

    $this->assertDatabaseHas('organization_positions', [
        'organization_id' => $this->organization->id,
        'position_id' => $this->position->id,
        'grade' => 10,
        'job_value' => 400,
        'cg' => 5,
        'is_active' => 1,
    ]);
});

test('authorized user can update position in organization', function () {
    $organizationPosition = OrganizationPosition::create([
        'organization_id' => $this->organization->id,
        'position_id' => $this->position->id,
        'grade' => 9,
        'job_value' => 350,
        'cg' => 4,
        'is_active' => true,
    ]);

    actingAs($this->manager)
        ->patchJson(route('organization-positions.update', $organizationPosition), [
            'organization_id' => $this->organization->id,
            'position_id' => $this->position->id,
            'grade' => 11,
            'job_value' => 450,
            'cg' => 6,
            'is_active' => false,
        ])
        ->assertRedirect(route('organizations.show', $this->organization));

    $this->assertDatabaseHas('organization_positions', [
        'id' => $organizationPosition->id,
        'grade' => 11,
        'job_value' => 450,
        'cg' => 6,
        'is_active' => 0,
    ]);
});

test('authorized user can remove position from organization', function () {
    $organizationPosition = OrganizationPosition::create([
        'organization_id' => $this->organization->id,
        'position_id' => $this->position->id,
        'grade' => 9,
        'job_value' => 350,
        'cg' => 4,
        'is_active' => true,
    ]);

    actingAs($this->manager)
        ->deleteJson(route('organization-positions.destroy', $organizationPosition))
        ->assertRedirect(route('organizations.show', $this->organization));

    $this->assertDatabaseMissing('organization_positions', [
        'id' => $organizationPosition->id,
    ]);
});

test('user without organization manage permission cannot manage positions in organization', function () {
    actingAs($this->viewer)
        ->postJson(route('organization-positions.store'), [
            'organization_id' => $this->organization->id,
            'position_id' => $this->position->id,
            'grade' => 10,
            'job_value' => 400,
            'cg' => 5,
            'is_active' => true,
        ])
        ->assertForbidden();
});

test('organization detail includes assigned positions and available positions', function () {
    OrganizationPosition::create([
        'organization_id' => $this->organization->id,
        'position_id' => $this->position->id,
        'grade' => 9,
        'job_value' => 350,
        'cg' => 4,
        'is_active' => true,
    ]);

    actingAs($this->viewer)
        ->get(route('organizations.show', $this->organization))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('organizations/show')
            ->where('organization.organization_positions.0.position.name', 'Head of Unit')
            ->where('organization.organization_positions.0.grade', 9)
            ->where('availablePositions.0.name', 'Head of Unit')
        );
});
