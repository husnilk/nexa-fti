<?php

use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureClassification;
use App\Models\PositionNomenclatureResponsibility;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin'));
});

test('authorized user can view nomenclature list', function () {
    actingAs($this->admin)
        ->get(route('position-nomenclatures.index'))
        ->assertOk();
});

test('authorized user can create nomenclature', function () {
    actingAs($this->admin)
        ->postJson(route('position-nomenclatures.store'), [
            'name' => 'Expert Architect',
            'grade' => 15,
            'qualification' => 'PhD',
        ])
        ->assertRedirect(route('position-nomenclatures.index'));

    $this->assertDatabaseHas('position_nomenclatures', [
        'name' => 'Expert Architect',
        'grade' => 15,
    ]);
});

test('authorized user can update nomenclature', function () {
    $nom = PositionNomenclature::create(['name' => 'Junior', 'grade' => 5]);

    actingAs($this->admin)
        ->patchJson(route('position-nomenclatures.update', $nom), [
            'name' => 'Senior',
            'grade' => 12,
        ])
        ->assertRedirect(route('position-nomenclatures.index'));

    $this->assertDatabaseHas('position_nomenclatures', [
        'id' => $nom->id,
        'name' => 'Senior',
        'grade' => 12,
    ]);
});

test('authorized user can search nomenclatures', function () {
    PositionNomenclature::create(['name' => 'Searchable Job', 'grade' => 1]);
    PositionNomenclature::create(['name' => 'Hidden Job', 'grade' => 1]);

    actingAs($this->admin)
        ->get(route('position-nomenclatures.index', ['search' => 'Searchable']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('nomenclatures', 1)
            ->where('nomenclatures.0.name', 'Searchable Job')
        );
});

test('authorized user can manage nomenclature responsibilities', function () {
    $nom = PositionNomenclature::create(['name' => 'Dev', 'grade' => 10]);

    // Create
    actingAs($this->admin)
        ->postJson(route('position-nomenclature-responsibilities.store'), [
            'position_nomenclature_id' => $nom->id,
            'name' => 'Write Code',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_nomenclature_responsibilities', [
        'position_nomenclature_id' => $nom->id,
        'name' => 'Write Code',
    ]);

    $resp = PositionNomenclatureResponsibility::first();

    // Update
    actingAs($this->admin)
        ->patchJson(route('position-nomenclature-responsibilities.update', $resp), [
            'name' => 'Review Code',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_nomenclature_responsibilities', [
        'id' => $resp->id,
        'name' => 'Review Code',
    ]);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('position-nomenclature-responsibilities.destroy', $resp))
        ->assertRedirect();

    $this->assertDatabaseMissing('position_nomenclature_responsibilities', [
        'id' => $resp->id,
    ]);
});

test('authorized user can manage nomenclature classifications', function () {
    $nom = PositionNomenclature::create(['name' => 'Manager', 'grade' => 12]);

    // Create
    actingAs($this->admin)
        ->postJson(route('position-nomenclature-classifications.store'), [
            'position_nomenclature_id' => $nom->id,
            'name' => 'Technical',
            'description' => 'For tech roles',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_nomenclature_classifications', [
        'position_nomenclature_id' => $nom->id,
        'name' => 'Technical',
    ]);

    $class = PositionNomenclatureClassification::first();

    // Update
    actingAs($this->admin)
        ->patchJson(route('position-nomenclature-classifications.update', $class), [
            'name' => 'Managerial',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('position_nomenclature_classifications', [
        'id' => $class->id,
        'name' => 'Managerial',
    ]);

    // Delete
    actingAs($this->admin)
        ->deleteJson(route('position-nomenclature-classifications.destroy', $class))
        ->assertRedirect();

    $this->assertDatabaseMissing('position_nomenclature_classifications', [
        'id' => $class->id,
    ]);
});
