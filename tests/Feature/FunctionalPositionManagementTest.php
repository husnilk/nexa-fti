<?php

use App\Models\FunctionalPosition;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin'));
});

test('authorized user can view functional position list', function () {
    actingAs($this->admin)
        ->get(route('functional-positions.index'))
        ->assertOk();
});

test('authorized user can create functional position', function () {
    actingAs($this->admin)
        ->postJson(route('functional-positions.store'), [
            'name' => 'Expert Auditor',
            'code' => 'AUD-01',
            'level' => 10,
            'grade' => 12,
            'job_value' => 500,
            'is_active' => true,
            'description' => 'Top level audit position',
        ])
        ->assertRedirect(route('functional-positions.index'));

    $this->assertDatabaseHas('functional_positions', [
        'name' => 'Expert Auditor',
        'code' => 'AUD-01',
        'level' => 10,
        'grade' => 12,
        'job_value' => 500,
        'is_active' => 1,
    ]);
});

test('authorized user can update functional position', function () {
    $fp = FunctionalPosition::create([
        'name' => 'Old Name',
        'code' => 'OLD',
        'level' => 1,
        'grade' => 2,
        'job_value' => 100,
    ]);

    actingAs($this->admin)
        ->patchJson(route('functional-positions.update', $fp), [
            'name' => 'New Name',
            'code' => 'NEW',
            'level' => 2,
            'grade' => 3,
            'job_value' => 200,
            'is_active' => false,
            'description' => 'Updated description',
        ])
        ->assertRedirect(route('functional-positions.index'));

    $this->assertDatabaseHas('functional_positions', [
        'id' => $fp->id,
        'name' => 'New Name',
        'code' => 'NEW',
        'grade' => 3,
        'job_value' => 200,
        'is_active' => 0,
    ]);
});

test('authorized user can search functional positions', function () {
    FunctionalPosition::create(['name' => 'Searchable FP', 'code' => 'S1', 'level' => 1, 'grade' => 2, 'job_value' => 100]);
    FunctionalPosition::create(['name' => 'Other FP', 'code' => 'O1', 'level' => 1, 'grade' => 3, 'job_value' => 200]);

    actingAs($this->admin)
        ->get(route('functional-positions.index', ['search' => 'Searchable']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('functionalPositions', 1)
            ->where('functionalPositions.0.name', 'Searchable FP')
        );
});

test('authorized user can delete functional position', function () {
    $fp = FunctionalPosition::create([
        'name' => 'To Delete',
        'code' => 'DEL',
        'level' => 1,
        'grade' => 1,
        'job_value' => 10,
    ]);

    actingAs($this->admin)
        ->deleteJson(route('functional-positions.destroy', $fp))
        ->assertRedirect(route('functional-positions.index'));

    $this->assertDatabaseMissing('functional_positions', [
        'id' => $fp->id,
    ]);
});

test('authorized user can view functional position detail', function () {
    $fp = FunctionalPosition::create([
        'name' => 'Detail FP',
        'code' => 'DET',
        'level' => 5,
        'grade' => 7,
        'job_value' => 350,
        'is_active' => false,
    ]);

    actingAs($this->admin)
        ->get(route('functional-positions.show', $fp))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('functional-positions/show')
            ->has('functionalPosition')
            ->where('functionalPosition.name', 'Detail FP')
            ->where('functionalPosition.grade', 7)
            ->where('functionalPosition.job_value', 350)
            ->where('functionalPosition.is_active', false)
        );
});

test('functional positions default to active', function () {
    $functionalPosition = FunctionalPosition::create([
        'name' => 'Default Active',
        'code' => 'ACTIVE',
        'level' => 2,
        'grade' => 4,
        'job_value' => 120,
    ]);

    expect($functionalPosition->fresh()->is_active)->toBeTrue();
});
