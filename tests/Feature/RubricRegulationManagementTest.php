<?php

use App\Models\Permission;
use App\Models\Rubric;
use App\Models\RubricRegulation;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    Storage::fake('public');

    Permission::findOrCreate('rubric.view', 'web');
    Permission::findOrCreate('rubric.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('rubric.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo('rubric.view');
});

function regulationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Pedoman Remunerasi',
        'regulation_number' => '12',
        'regulation_year' => '2026',
        'description' => 'Rubrik kinerja',
    ], $overrides);
}

test('viewer can list regulations but not change them', function () {
    $regulation = RubricRegulation::factory()->create();

    actingAs($this->viewer)
        ->get(route('rubric-regulations.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rubric-regulations/index')
            ->has('regulations', 1));

    actingAs($this->viewer)->post(route('rubric-regulations.store'), regulationPayload())->assertForbidden();
    actingAs($this->viewer)->put(route('rubric-regulations.update', $regulation), regulationPayload())->assertForbidden();
    actingAs($this->viewer)->delete(route('rubric-regulations.destroy', $regulation))->assertForbidden();
});

test('manager can create a regulation with a document', function () {
    actingAs($this->manager)
        ->post(route('rubric-regulations.store'), regulationPayload([
            'file' => UploadedFile::fake()->create('pedoman.pdf', 100, 'application/pdf'),
        ]))
        ->assertSessionHasNoErrors();

    $regulation = RubricRegulation::first();

    expect($regulation->name)->toBe('Pedoman Remunerasi')
        ->and($regulation->file_path)->toStartWith('rubric/regulations/');
    Storage::disk('public')->assertExists($regulation->file_path);
});

test('regulation documents must be PDFs', function () {
    actingAs($this->manager)
        ->post(route('rubric-regulations.store'), regulationPayload([
            'file' => UploadedFile::fake()->create('pedoman.docx', 100),
        ]))
        ->assertSessionHasErrors('file');
});

test('manager can replace and remove a regulation document', function () {
    $old = UploadedFile::fake()->create('old.pdf', 10, 'application/pdf')->store('rubric/regulations', 'public');
    $regulation = RubricRegulation::factory()->create(['file_path' => $old]);

    actingAs($this->manager)
        ->put(route('rubric-regulations.update', $regulation), regulationPayload([
            'file' => UploadedFile::fake()->create('new.pdf', 10, 'application/pdf'),
        ]))
        ->assertSessionHasNoErrors();

    $new = $regulation->fresh()->file_path;
    expect($new)->not->toBe($old);
    Storage::disk('public')->assertMissing($old);
    Storage::disk('public')->assertExists($new);

    actingAs($this->manager)
        ->put(route('rubric-regulations.update', $regulation), regulationPayload(['remove_file' => true]))
        ->assertSessionHasNoErrors();

    expect($regulation->fresh()->file_path)->toBeNull();
    Storage::disk('public')->assertMissing($new);
});

test('updating without a new file keeps the existing document', function () {
    $path = UploadedFile::fake()->create('keep.pdf', 10, 'application/pdf')->store('rubric/regulations', 'public');
    $regulation = RubricRegulation::factory()->create(['file_path' => $path]);

    actingAs($this->manager)
        ->put(route('rubric-regulations.update', $regulation), regulationPayload(['name' => 'Renamed']))
        ->assertSessionHasNoErrors();

    expect($regulation->fresh())
        ->name->toBe('Renamed')
        ->file_path->toBe($path);
});

test('a regulation used by rubrics cannot be deleted', function () {
    $rubric = Rubric::factory()->create();

    actingAs($this->manager)
        ->delete(route('rubric-regulations.destroy', $rubric->rubric_regulation_id))
        ->assertSessionHasErrors('regulation');

    expect($rubric->fresh())->not->toBeNull();
});

test('deleting a regulation removes its document', function () {
    $path = UploadedFile::fake()->create('gone.pdf', 10, 'application/pdf')->store('rubric/regulations', 'public');
    $regulation = RubricRegulation::factory()->create(['file_path' => $path]);

    actingAs($this->manager)->delete(route('rubric-regulations.destroy', $regulation))->assertRedirect();

    expect(RubricRegulation::count())->toBe(0);
    Storage::disk('public')->assertMissing($path);
});

test('manager can activate and deactivate a regulation', function () {
    $regulation = RubricRegulation::factory()->create();

    actingAs($this->manager)->patch(route('rubric-regulations.toggle-status', $regulation))->assertRedirect();
    expect($regulation->fresh()->is_active)->toBe(RubricRegulation::STATUS_INACTIVE);

    actingAs($this->manager)->patch(route('rubric-regulations.toggle-status', $regulation))->assertRedirect();
    expect($regulation->fresh()->is_active)->toBe(RubricRegulation::STATUS_ACTIVE);
});

test('viewer cannot activate or deactivate a regulation', function () {
    $regulation = RubricRegulation::factory()->create();

    actingAs($this->viewer)->patch(route('rubric-regulations.toggle-status', $regulation))->assertForbidden();
    expect($regulation->fresh()->is_active)->toBe(RubricRegulation::STATUS_ACTIVE);
});

test('the regulation list includes inactive regulations', function () {
    RubricRegulation::factory()->create();
    RubricRegulation::factory()->create(['is_active' => RubricRegulation::STATUS_INACTIVE]);

    actingAs($this->viewer)
        ->get(route('rubric-regulations.index'))
        ->assertInertia(fn ($page) => $page->has('regulations', 2));
});
