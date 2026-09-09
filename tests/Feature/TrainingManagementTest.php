<?php

use App\Models\Employee;
use App\Models\Role;
use App\Models\Training;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->employees = Employee::factory()->count(3)->create();
});

test('authorized user can view training index page', function () {
    actingAs($this->admin)
        ->get(route('trainings.index'))
        ->assertSuccessful();
});

test('authorized user can add training', function () {
    actingAs($this->admin)
        ->postJson(route('trainings.store'), [
            'title' => 'Advanced Laravel Development',
            'description' => 'A training course covering Inertia, Wayfinder, and Pest.',
            'provider' => 'Spatie Academy',
            'location' => 'Online',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
            'hours' => 40,
            'employee_ids' => $this->employees->pluck('id')->toArray(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('trainings', [
        'title' => 'Advanced Laravel Development',
        'provider' => 'Spatie Academy',
        'hours' => 40,
    ]);

    $training = Training::where('title', 'Advanced Laravel Development')->first();
    expect($training->employees)->toHaveCount(3);
});

test('authorized user can update training', function () {
    $training = Training::factory()->create([
        'title' => 'Old Training Title',
    ]);
    $training->employees()->attach($this->employees->pluck('id')->toArray());

    $newEmployee = Employee::factory()->create();

    actingAs($this->admin)
        ->patchJson(route('trainings.update', $training), [
            'title' => 'Updated Training Title',
            'provider' => 'Laravel LLC',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
            'employee_ids' => [$newEmployee->id],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('trainings', [
        'id' => $training->id,
        'title' => 'Updated Training Title',
        'provider' => 'Laravel LLC',
    ]);

    $training->refresh();
    expect($training->employees)->toHaveCount(1);
    expect($training->employees->first()->id)->toBe($newEmployee->id);
});

test('authorized user can delete training', function () {
    $training = Training::factory()->create();

    actingAs($this->admin)
        ->deleteJson(route('trainings.destroy', $training))
        ->assertRedirect();

    $this->assertDatabaseMissing('trainings', [
        'id' => $training->id,
    ]);
});

test('unauthorized user cannot manage training', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('trainings.index'))
        ->assertForbidden();

    actingAs($user)
        ->postJson(route('trainings.store'), [
            'title' => 'Hackers training',
            'provider' => 'Evil Corp',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-05',
        ])
        ->assertForbidden();
});
