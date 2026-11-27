<?php

use App\Models\Permission;
use App\Models\Rubric;
use App\Models\RubricCategory;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('rubric.view', 'web');
    Permission::findOrCreate('rubric.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('rubric.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo('rubric.view');
});

test('viewer can list categories but not change them', function () {
    $category = RubricCategory::factory()->create();

    actingAs($this->viewer)
        ->get(route('rubric-categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubric-categories/index')
            ->has('categories', 1)
            ->where('categories.0.rubrics_count', 0));

    actingAs($this->viewer)->post(route('rubric-categories.store'), ['name' => 'X', 'code' => 'X'])->assertForbidden();
    actingAs($this->viewer)->put(route('rubric-categories.update', $category), ['name' => 'X', 'code' => 'X'])->assertForbidden();
    actingAs($this->viewer)->delete(route('rubric-categories.destroy', $category))->assertForbidden();
});

test('manager can create, update and delete a category', function () {
    actingAs($this->manager)
        ->post(route('rubric-categories.store'), ['code' => 'PND', 'name' => 'Pendidikan', 'description' => 'Teaching'])
        ->assertSessionHasNoErrors();

    $category = RubricCategory::firstWhere('code', 'PND');
    expect($category->name)->toBe('Pendidikan');

    actingAs($this->manager)
        ->put(route('rubric-categories.update', $category), ['code' => 'PND', 'name' => 'Pendidikan & Pengajaran'])
        ->assertSessionHasNoErrors();
    expect($category->fresh()->name)->toBe('Pendidikan & Pengajaran');

    actingAs($this->manager)->delete(route('rubric-categories.destroy', $category))->assertRedirect();
    expect(RubricCategory::count())->toBe(0);
});

test('category codes must be unique', function () {
    RubricCategory::factory()->create(['code' => 'PND']);

    actingAs($this->manager)
        ->post(route('rubric-categories.store'), ['code' => 'PND', 'name' => 'Duplicate'])
        ->assertSessionHasErrors('code');
});

test('a category used by rubrics cannot be deleted', function () {
    $rubric = Rubric::factory()->create();

    actingAs($this->manager)
        ->delete(route('rubric-categories.destroy', $rubric->rubric_category_id))
        ->assertSessionHasErrors('category');

    expect($rubric->fresh())->not->toBeNull();
});
