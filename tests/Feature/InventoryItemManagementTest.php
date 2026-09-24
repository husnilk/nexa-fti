<?php

use App\Models\Employee;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseEmpty;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::findOrCreate('inventory.manage', 'web');
    $superAdminRole = Role::findOrCreate('super-admin', 'web');

    $this->adminEmployee = Employee::factory()->create();
    $this->admin = User::find($this->adminEmployee->id);
    $this->admin->assignRole($superAdminRole);

    $this->category = ItemCategory::factory()->create();
    Storage::fake('public');
});

test('user with inventory.manage permission can view items with categories and variants', function () {
    $item = Item::factory()->create([
        'item_category_id' => $this->category->id,
        'name' => 'Laptop Backpack',
        'code' => 'ITM-BP-01',
    ]);

    $item->variants()->create(['name' => 'Black']);
    $item->variants()->create(['name' => 'Grey']);

    actingAs($this->admin)
        ->get(route('inventory-items.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('inventory/items/index')
            ->has('items', 1)
            ->where('items.0.name', 'Laptop Backpack')
            ->where('items.0.variants.0.name', 'Black')
            ->where('items.0.variants.1.name', 'Grey')
        );
});

test('can create item without picture and without variants', function () {
    actingAs($this->admin)
        ->post(route('inventory-items.store'), [
            'item_category_id' => $this->category->id,
            'name' => 'Basic Pen',
            'code' => 'ITM-PEN-01',
            'unit' => 'pcs',
            'minimal_quantity' => 10,
            'description' => 'A simple ballpoint pen',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    assertDatabaseHas('items', [
        'name' => 'Basic Pen',
        'code' => 'ITM-PEN-01',
        'picture' => null,
    ]);

    $item = Item::where('code', 'ITM-PEN-01')->firstOrFail();
    expect($item->variants)->toBeEmpty();
});

test('can create item with picture and multiple variants', function () {
    $file = UploadedFile::fake()->image('backpack.jpg');

    actingAs($this->admin)
        ->post(route('inventory-items.store'), [
            'item_category_id' => $this->category->id,
            'name' => 'T-Shirt',
            'code' => 'ITM-TSH-01',
            'unit' => 'pcs',
            'minimal_quantity' => 5,
            'description' => 'Cotton t-shirt',
            'picture' => $file,
            'variants' => ['Black', 'White', 'Blue'],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $item = Item::where('code', 'ITM-TSH-01')->firstOrFail();
    expect($item->picture)->not->toBeNull();
    Storage::disk('public')->assertExists($item->picture);

    assertDatabaseHas('item_variants', [
        'item_id' => $item->id,
        'name' => 'Black',
    ]);
    assertDatabaseHas('item_variants', [
        'item_id' => $item->id,
        'name' => 'White',
    ]);
    assertDatabaseHas('item_variants', [
        'item_id' => $item->id,
        'name' => 'Blue',
    ]);
    expect($item->variants)->toHaveCount(3);
});

test('can update item details, replace picture, and update variants', function () {
    $oldFile = UploadedFile::fake()->image('old.jpg');
    $oldPath = $oldFile->store('items', 'public');

    $item = Item::factory()->create([
        'item_category_id' => $this->category->id,
        'name' => 'Old Name',
        'code' => 'ITM-OLD-01',
        'picture' => $oldPath,
    ]);

    $item->variants()->create(['name' => 'Old Variant']);

    $newFile = UploadedFile::fake()->image('new.jpg');

    actingAs($this->admin)
        ->put(route('inventory-items.update', $item), [
            'item_category_id' => $this->category->id,
            'name' => 'New Name',
            'code' => 'ITM-OLD-01',
            'unit' => 'pcs',
            'minimal_quantity' => 12,
            'picture' => $newFile,
            'variants' => ['Red', 'Green'],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $item->refresh();

    expect($item->name)->toBe('New Name');
    expect($item->picture)->not->toBe($oldPath);
    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($item->picture);

    assertDatabaseMissing('item_variants', ['name' => 'Old Variant']);
    assertDatabaseHas('item_variants', ['item_id' => $item->id, 'name' => 'Red']);
    assertDatabaseHas('item_variants', ['item_id' => $item->id, 'name' => 'Green']);
    expect($item->variants)->toHaveCount(2);
});

test('can remove picture from an item', function () {
    $oldFile = UploadedFile::fake()->image('backpack.jpg');
    $oldPath = $oldFile->store('items', 'public');

    $item = Item::factory()->create([
        'item_category_id' => $this->category->id,
        'code' => 'ITM-RM-01',
        'picture' => $oldPath,
    ]);

    actingAs($this->admin)
        ->put(route('inventory-items.update', $item), [
            'item_category_id' => $this->category->id,
            'name' => $item->name,
            'code' => $item->code,
            'unit' => $item->unit,
            'minimal_quantity' => $item->minimal_quantity,
            'remove_picture' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $item->refresh();

    expect($item->picture)->toBeNull();
    Storage::disk('public')->assertMissing($oldPath);
});

test('can update item with new picture using method spoofing POST with _method PUT', function () {
    $item = Item::factory()->create([
        'item_category_id' => $this->category->id,
        'code' => 'ITM-SPOOF-01',
    ]);

    $newFile = UploadedFile::fake()->image('updated.png');

    actingAs($this->admin)
        ->post(route('inventory-items.update', $item), [
            '_method' => 'PUT',
            'item_category_id' => $this->category->id,
            'name' => 'Updated Name',
            'code' => 'ITM-SPOOF-01',
            'unit' => 'pcs',
            'minimal_quantity' => 10,
            'picture' => $newFile,
            'variants' => ['Color: Blue', 'Color: Red'],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $item->refresh();

    expect($item->name)->toBe('Updated Name');
    expect($item->picture)->not->toBeNull();
    Storage::disk('public')->assertExists($item->picture);
    expect($item->variants)->toHaveCount(2);
});

test('deleting an item deletes its variants and stored picture', function () {
    $file = UploadedFile::fake()->image('item.jpg');
    $path = $file->store('items', 'public');

    $item = Item::factory()->create([
        'item_category_id' => $this->category->id,
        'picture' => $path,
    ]);

    $item->variants()->create(['name' => 'Variant A']);

    actingAs($this->admin)
        ->delete(route('inventory-items.destroy', $item))
        ->assertRedirect();

    assertDatabaseMissing('items', ['id' => $item->id]);
    assertDatabaseEmpty('item_variants');
    Storage::disk('public')->assertMissing($path);
});

test('picture must be a valid image file', function () {
    $nonImageFile = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

    actingAs($this->admin)
        ->post(route('inventory-items.store'), [
            'item_category_id' => $this->category->id,
            'name' => 'Invalid Item',
            'code' => 'ITM-INV-01',
            'unit' => 'pcs',
            'minimal_quantity' => 1,
            'picture' => $nonImageFile,
        ])
        ->assertSessionHasErrors('picture');
});
