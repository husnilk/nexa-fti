<?php

use App\Models\EmploymentType;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Rubric;
use App\Models\RubricCategory;
use App\Models\RubricDetail;
use App\Models\RubricEmploymentType;
use App\Models\RubricOrganization;
use App\Models\RubricRegulation;
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

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();

    $this->category = RubricCategory::factory()->create();
    $this->regulation = RubricRegulation::factory()->create();
    $this->employmentType = EmploymentType::factory()->create();
});

function rubricPayload(array $overrides = []): array
{
    return array_merge([
        'rubric_category_id' => test()->category->id,
        'rubric_regulation_id' => test()->regulation->id,
        'activity' => 'Membimbing tugas akhir',
        'code' => 'PND-01',
        'description' => 'Pembimbingan skripsi mahasiswa S1',
        'description_prove' => 'SK pembimbing dan berita acara',
        'quantity' => 1,
        'unit' => 'mahasiswa',
        'form_type' => 0,
        'personal' => 1,
        'assignment_file' => 'SK Pembimbing',
        'performance_file' => 'Berita Acara',
        'flat_rate' => 0,
        'is_poin_fixed' => 0,
        'is_extra_poin' => 0,
        'is_rasionalized' => 0,
        'is_general' => 0,
        'is_active' => 1,
        'is_flat_rate' => 0,
        'rule_max_poin' => -1,
        'rule_min_poin' => -1,
        'rule_max_employee' => 2,
        'rule_min_employee' => 1,
        'details' => [
            ['position' => 'Pembimbing Utama', 'poin' => 2, 'is_fixed_poin' => 0, 'is_active' => 1],
            ['position' => 'Pembimbing Pendamping', 'poin' => 1, 'is_fixed_poin' => 1, 'is_active' => 1],
        ],
        'organization_ids' => [],
        'employment_type_ids' => [test()->employmentType->id],
    ], $overrides);
}

test('users with rubric.view or rubric.manage can view the rubric list', function (string $user) {
    Rubric::factory()->count(2)->create();

    actingAs($this->{$user})
        ->get(route('rubrics.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubrics/index')
            ->has('rubrics', 2)
            ->has('categories')
            ->has('regulations'));
})->with(['manager', 'viewer', 'admin']);

test('users with rubric.view can view a rubric detail', function () {
    $rubric = Rubric::factory()->create();
    RubricDetail::factory()->for($rubric)->create();

    actingAs($this->viewer)
        ->get(route('rubrics.show', $rubric))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubrics/show')
            ->where('rubric.id', $rubric->id)
            ->has('rubric.details', 1)
            ->has('rubric.category')
            ->has('rubric.regulation'));
});

test('users without rubric permissions cannot access the module', function () {
    $rubric = Rubric::factory()->create();

    actingAs($this->guest)->get(route('rubrics.index'))->assertForbidden();
    actingAs($this->guest)->get(route('rubrics.show', $rubric))->assertForbidden();
    actingAs($this->guest)->get(route('rubric-categories.index'))->assertForbidden();
    actingAs($this->guest)->get(route('rubric-regulations.index'))->assertForbidden();
});

test('users with only rubric.view cannot change rubrics', function () {
    $rubric = Rubric::factory()->create();

    actingAs($this->viewer)->get(route('rubrics.create'))->assertForbidden();
    actingAs($this->viewer)->get(route('rubrics.edit', $rubric))->assertForbidden();
    actingAs($this->viewer)->post(route('rubrics.store'), rubricPayload())->assertForbidden();
    actingAs($this->viewer)->put(route('rubrics.update', $rubric), rubricPayload())->assertForbidden();
    actingAs($this->viewer)->patch(route('rubrics.toggle-status', $rubric))->assertForbidden();
    actingAs($this->viewer)->delete(route('rubrics.destroy', $rubric))->assertForbidden();

    expect(Rubric::count())->toBe(1);
});

test('manager can open the create and edit forms', function () {
    $rubric = Rubric::factory()->create();

    actingAs($this->manager)
        ->get(route('rubrics.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubrics/create')
            ->has('categories', 2)
            ->has('regulations', 2)
            ->has('organizations')
            ->has('employmentTypes')
            ->where('options.formTypes.0', ['value' => 0, 'label' => 'Form Type 0']));

    actingAs($this->manager)
        ->get(route('rubrics.edit', $rubric))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubrics/edit')
            ->where('rubric.id', $rubric->id));
});

test('manager can create a rubric with details and employment types', function () {
    $response = actingAs($this->manager)->post(route('rubrics.store'), rubricPayload());

    $rubric = Rubric::firstWhere('code', 'PND-01');

    $response->assertRedirect(route('rubrics.show', $rubric));
    expect($rubric->activity)->toBe('Membimbing tugas akhir')
        ->and($rubric->details()->pluck('poin', 'position')->all())
        ->toEqual(['Pembimbing Utama' => 2, 'Pembimbing Pendamping' => 1])
        ->and($rubric->organizations()->count())->toBe(0)
        ->and($rubric->employmentTypes()->pluck('employment_type_id')->all())
        ->toBe([$this->employmentType->id]);
});

test('a rubric can be restricted to specific organizations', function () {
    $organizations = Organization::factory()->count(2)->create();

    actingAs($this->manager)
        ->post(route('rubrics.store'), rubricPayload([
            'organization_ids' => $organizations->pluck('id')->all(),
        ]))
        ->assertSessionHasNoErrors();

    expect(Rubric::first()->organizations()->pluck('organization_id')->sort()->values()->all())
        ->toBe($organizations->pluck('id')->sort()->values()->all());
});

test('a rubric requires at least one detail and one employment type', function () {
    actingAs($this->manager)
        ->post(route('rubrics.store'), rubricPayload([
            'details' => [],
            'employment_type_ids' => [],
        ]))
        ->assertSessionHasErrors(['details', 'employment_type_ids']);

    expect(Rubric::count())->toBe(0);
});

test('rubric validation rejects invalid input', function () {
    Rubric::factory()->create(['code' => 'PND-01']);

    actingAs($this->manager)
        ->post(route('rubrics.store'), rubricPayload([
            'rubric_category_id' => fake()->uuid(),
            'activity' => '',
            'form_type' => 99,
            'rule_max_poin' => -2,
            'details' => [
                ['position' => 'Ketua', 'poin' => 1, 'is_fixed_poin' => 0, 'is_active' => 1],
                ['position' => 'ketua', 'poin' => -1, 'is_fixed_poin' => 0, 'is_active' => 1],
            ],
            'organization_ids' => [fake()->uuid()],
        ]))
        ->assertSessionHasErrors([
            'code',
            'rubric_category_id',
            'activity',
            'form_type',
            'rule_max_poin',
            'details.0.position',
            'details.1.poin',
            'organization_ids.0',
        ]);
});

test('manager can update a rubric and sync its details and assignments', function () {
    $rubric = Rubric::factory()->create(['code' => 'PND-01']);
    $kept = RubricDetail::factory()->for($rubric)->create(['position' => 'Ketua', 'poin' => 5]);
    $removed = RubricDetail::factory()->for($rubric)->create(['position' => 'Anggota']);
    RubricOrganization::factory()->for($rubric)->create();
    $oldType = RubricEmploymentType::factory()->for($rubric)->create();

    $newType = EmploymentType::factory()->create();

    actingAs($this->manager)
        ->put(route('rubrics.update', $rubric), rubricPayload([
            'activity' => 'Updated activity',
            'details' => [
                ['id' => $kept->id, 'position' => 'Ketua', 'poin' => 8, 'is_fixed_poin' => 1, 'is_active' => 1],
                ['id' => null, 'position' => 'Sekretaris', 'poin' => 3, 'is_fixed_poin' => 0, 'is_active' => 1],
            ],
            'organization_ids' => [],
            'employment_type_ids' => [$oldType->employment_type_id, $newType->id],
        ]))
        ->assertRedirect(route('rubrics.show', $rubric));

    $rubric->refresh();

    expect($rubric->activity)->toBe('Updated activity')
        ->and($kept->fresh()->poin)->toEqual(8)
        ->and($kept->fresh()->is_fixed_poin)->toBe(1)
        ->and($removed->fresh())->toBeNull()
        ->and($rubric->details()->pluck('position')->sort()->values()->all())->toBe(['Ketua', 'Sekretaris'])
        ->and($rubric->organizations()->count())->toBe(0)
        ->and($rubric->employmentTypes()->pluck('employment_type_id')->sort()->values()->all())
        ->toBe(collect([$oldType->employment_type_id, $newType->id])->sort()->values()->all())
        ->and($oldType->fresh())->not->toBeNull();
});

test('a detail id from another rubric is not taken over on update', function () {
    $rubric = Rubric::factory()->create(['code' => 'PND-01']);
    RubricDetail::factory()->for($rubric)->create();
    $foreign = RubricDetail::factory()->create(['position' => 'Foreign']);

    actingAs($this->manager)
        ->put(route('rubrics.update', $rubric), rubricPayload([
            'details' => [
                ['id' => $foreign->id, 'position' => 'Ketua', 'poin' => 1, 'is_fixed_poin' => 0, 'is_active' => 1],
            ],
        ]))
        ->assertSessionHasNoErrors();

    expect($foreign->fresh()->position)->toBe('Foreign')
        ->and($foreign->fresh()->rubric_id)->not->toBe($rubric->id)
        ->and($rubric->details()->pluck('position')->all())->toBe(['Ketua']);
});

test('manager can activate and deactivate a rubric', function () {
    $rubric = Rubric::factory()->create(['is_active' => 1]);

    actingAs($this->manager)->patch(route('rubrics.toggle-status', $rubric))->assertRedirect();
    expect($rubric->fresh()->is_active)->toBe(Rubric::STATUS_INACTIVE);

    actingAs($this->manager)->patch(route('rubrics.toggle-status', $rubric))->assertRedirect();
    expect($rubric->fresh()->is_active)->toBe(Rubric::STATUS_ACTIVE);
});

test('manager can delete a rubric with its related rows', function () {
    $rubric = Rubric::factory()->create();
    RubricDetail::factory()->for($rubric)->create();
    RubricOrganization::factory()->for($rubric)->create();
    RubricEmploymentType::factory()->for($rubric)->create();

    actingAs($this->manager)
        ->delete(route('rubrics.destroy', $rubric))
        ->assertRedirect(route('rubrics.index'));

    expect(Rubric::count())->toBe(0)
        ->and(RubricDetail::count())->toBe(0)
        ->and(RubricOrganization::count())->toBe(0)
        ->and(RubricEmploymentType::count())->toBe(0);
});

test('rubrics are available to all organizations unless restricted', function () {
    [$unitA, $unitB] = Organization::factory()->count(2)->create();

    $open = Rubric::factory()->create();
    $restricted = Rubric::factory()->create();
    RubricOrganization::factory()->for($restricted)->create(['organization_id' => $unitA->id]);

    expect(Rubric::availableToOrganization($unitA->id)->pluck('id')->sort()->values()->all())
        ->toBe(collect([$open->id, $restricted->id])->sort()->values()->all())
        ->and(Rubric::availableToOrganization($unitB->id)->pluck('id')->all())
        ->toBe([$open->id]);
});

test('rubrics are only available to their listed employment types', function () {
    $other = EmploymentType::factory()->create();

    $allowed = Rubric::factory()->create();
    RubricEmploymentType::factory()->for($allowed)->create(['employment_type_id' => $this->employmentType->id]);
    Rubric::factory()->create();

    expect(Rubric::availableToEmploymentType($this->employmentType->id)->pluck('id')->all())
        ->toBe([$allowed->id])
        ->and(Rubric::availableToEmploymentType($other->id)->count())->toBe(0);
});

test('the rubric list only shows rubrics with an active regulation by default', function () {
    $inactiveRegulation = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    $visible = Rubric::factory()->create(['rubric_regulation_id' => $this->regulation->id]);
    Rubric::factory()->create(['rubric_regulation_id' => $inactiveRegulation->id]);

    actingAs($this->viewer)
        ->get(route('rubrics.index'))
        ->assertInertia(fn ($page) => $page
            ->has('rubrics', 1)
            ->where('rubrics.0.id', $visible->id)
            ->has('regulations', 1)
            ->where('regulations.0.id', $this->regulation->id)
            ->where('filters.regulation_status', 'active'));
});

test('the rubric list can include rubrics with an inactive regulation', function () {
    $inactiveRegulation = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    Rubric::factory()->create(['rubric_regulation_id' => $this->regulation->id]);
    Rubric::factory()->create(['rubric_regulation_id' => $inactiveRegulation->id]);

    actingAs($this->viewer)
        ->get(route('rubrics.index', ['regulation_status' => 'all']))
        ->assertInertia(fn ($page) => $page
            ->has('rubrics', 2)
            ->has('regulations', 2)
            ->where('filters.regulation_status', 'all'));
});

test('a rubric with an inactive regulation can still be opened directly', function () {
    $inactiveRegulation = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    $rubric = Rubric::factory()->create(['rubric_regulation_id' => $inactiveRegulation->id]);

    actingAs($this->viewer)
        ->get(route('rubrics.show', $rubric))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('rubric.regulation.is_active', 0));
});

test('the rubric form only offers active regulations, plus the current one when editing', function () {
    $inactiveRegulation = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    $rubric = Rubric::factory()->create(['rubric_regulation_id' => $inactiveRegulation->id]);

    actingAs($this->manager)
        ->get(route('rubrics.create'))
        ->assertInertia(fn ($page) => $page
            ->has('regulations', 1)
            ->where('regulations.0.id', $this->regulation->id));

    actingAs($this->manager)
        ->get(route('rubrics.edit', $rubric))
        ->assertInertia(fn ($page) => $page->has('regulations', 2));
});

test('a new rubric cannot use an inactive regulation', function () {
    $inactiveRegulation = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);

    actingAs($this->manager)
        ->post(route('rubrics.store'), rubricPayload(['rubric_regulation_id' => $inactiveRegulation->id]))
        ->assertSessionHasErrors('rubric_regulation_id');

    expect(Rubric::count())->toBe(0);
});

test('a rubric keeps its inactive regulation on update but cannot switch to another inactive one', function () {
    $current = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    $otherInactive = RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);
    $rubric = Rubric::factory()->create(['code' => 'PND-01', 'rubric_regulation_id' => $current->id]);

    actingAs($this->manager)
        ->put(route('rubrics.update', $rubric), rubricPayload(['rubric_regulation_id' => $current->id]))
        ->assertSessionHasNoErrors();

    actingAs($this->manager)
        ->put(route('rubrics.update', $rubric), rubricPayload(['rubric_regulation_id' => $otherInactive->id]))
        ->assertSessionHasErrors('rubric_regulation_id');

    actingAs($this->manager)
        ->put(route('rubrics.update', $rubric), rubricPayload(['rubric_regulation_id' => fake()->uuid()]))
        ->assertSessionHasErrors('rubric_regulation_id');

    expect($rubric->fresh()->rubric_regulation_id)->toBe($current->id);
});
