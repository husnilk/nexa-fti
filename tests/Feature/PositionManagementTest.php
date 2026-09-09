<?php

use App\Models\Organization;
use App\Models\OrganizationPosition;
use App\Models\OrganizationType;
use App\Models\Position;
use App\Models\PositionResponsibility;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin'));
});

test('authorized user can view position list', function () {
    actingAs($this->admin)
        ->get(route('positions.index'))
        ->assertOk();
});

test('authorized user can create position', function () {
    actingAs($this->admin)
        ->postJson(route('positions.store'), [
            'name' => 'Manager',
            'grade' => 10,
            'job_value' => 500,
            'cg' => 3,
            'skp_point' => 90,
            'is_active' => 1,
            'qualification' => 'Master degree',
            'description' => 'Manages team',
        ])
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('positions', [
        'name' => 'Manager',
        'grade' => 10,
        'job_value' => 500,
        'cg' => 3,
        'skp_point' => 90,
        'is_active' => 1,
    ]);
});

test('authorized user can update position', function () {
    $pos = Position::create(['name' => 'Old', 'grade' => 1, 'job_value' => 10, 'cg' => 1, 'skp_point' => 20, 'is_active' => 1]);

    actingAs($this->admin)
        ->patchJson(route('positions.update', $pos), [
            'name' => 'New',
            'grade' => 2,
            'job_value' => 20,
            'cg' => 2,
            'skp_point' => 40,
            'is_active' => 0,
        ])
        ->assertRedirect(route('positions.index'));

    $this->assertDatabaseHas('positions', [
        'id' => $pos->id,
        'name' => 'New',
        'cg' => 2,
        'skp_point' => 40,
        'is_active' => 0,
    ]);
});

test('authorized user can search positions', function () {
    Position::create(['name' => 'Specific Position', 'grade' => 1, 'job_value' => 10, 'cg' => 2, 'skp_point' => 10, 'is_active' => 1]);
    Position::create(['name' => 'Other Position', 'grade' => 1, 'job_value' => 10, 'cg' => 3, 'skp_point' => 20, 'is_active' => 1]);

    actingAs($this->admin)
        ->get(route('positions.index', ['search' => 'Specific']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('positions', 1)
            ->where('positions.0.name', 'Specific Position')
        );
});

test('authorized user can manage responsibilities', function () {
    $pos = Position::create(['name' => 'Manager', 'grade' => 10, 'job_value' => 500, 'cg' => 5, 'skp_point' => 120, 'is_active' => 1]);

    // Create
    actingAs($this->admin)
        ->postJson(route('position-responsibilities.store'), [
            'position_id' => $pos->id,
            'title' => 'Main Task',
            'description' => 'Doing things',
            'type' => 'primary',
            'order' => 1,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_responsibilities', [
        'position_id' => $pos->id,
        'title' => 'Main Task',
        'type' => 'primary',
    ]);

    $resp = PositionResponsibility::first();

    // Update
    actingAs($this->admin)
        ->patchJson(route('position-responsibilities.update', $resp), [
            'title' => 'Updated Task',
            'type' => 'secondary',
            'order' => 2,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_responsibilities', [
        'id' => $resp->id,
        'title' => 'Updated Task',
        'type' => 'secondary',
    ]);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('position-responsibilities.destroy', $resp))
        ->assertRedirect();

    $this->assertDatabaseMissing('position_responsibilities', [
        'id' => $resp->id,
    ]);
});

test('authorized user can view position detail', function () {
    $position = Position::create([
        'name' => 'Detail Position',
        'grade' => 8,
        'job_value' => 350,
        'cg' => 4,
        'skp_point' => 75,
        'is_active' => 1,
    ]);

    actingAs($this->admin)
        ->get(route('positions.show', $position))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('positions/show')
            ->where('position.name', 'Detail Position')
            ->where('position.cg', 4)
            ->where('position.skp_point', 75)
        );
});

test('authorized user can view position organizations page', function () {
    $organizationType = OrganizationType::firstOrCreate(
        ['name' => 'Lainnya'],
        ['level' => 4],
    );

    $position = Position::create([
        'name' => 'Assigned Position',
        'grade' => 8,
        'job_value' => 350,
        'cg' => 4,
        'skp_point' => 75,
        'is_active' => 1,
    ]);

    $organization = Organization::create([
        'organization_type_id' => $organizationType->id,
        'name' => 'Finance Office',
        'code' => 'FIN',
        'is_active' => true,
    ]);

    OrganizationPosition::create([
        'organization_id' => $organization->id,
        'position_id' => $position->id,
        'grade' => 9,
        'job_value' => 375,
        'cg' => 5,
        'is_active' => true,
    ]);

    actingAs($this->admin)
        ->get(route('positions.organization-positions'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('positions/organization-positions')
            ->where('positions.0.name', 'Assigned Position')
            ->where('positions.0.organization_positions_count', 1)
            ->where('positions.0.organization_positions.0.organization.name', 'Finance Office')
            ->where('positions.0.organization_positions.0.grade', 9)
        );
});

test('positions default cg and skp point to zero', function () {
    $position = Position::create([
        'name' => 'Legacy Position',
        'grade' => 6,
        'job_value' => 250,
        'is_active' => 1,
    ]);

    $this->assertDatabaseHas('positions', [
        'id' => $position->id,
        'cg' => 0,
        'skp_point' => 0,
    ]);
});
