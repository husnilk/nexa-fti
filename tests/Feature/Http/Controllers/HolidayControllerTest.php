<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\Hr\HolidayController;
use App\Http\Requests\HolidayStoreRequest;
use App\Http\Requests\HolidayUpdateRequest;
use App\Models\Holiday;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/**
 * @see HolidayController
 */
final class HolidayControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(PreventRequestForgery::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));
    }

    #[Test]
    public function index_displays_view(): void
    {
        Holiday::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('holidays.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('holidays/index'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            HolidayController::class,
            'store',
            HolidayStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $date = fake()->date();
        $name = fake()->name();

        $response = $this->actingAs($this->admin)->post(route('holidays.store'), [
            'date' => $date,
            'name' => $name,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('holidays', [
            'date' => $date,
            'name' => $name,
        ]);

        $response->assertRedirect(route('holidays.index'));
    }

    #[Test]
    public function show_displays_view(): void
    {
        $holiday = Holiday::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('holidays.show', $holiday));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('holidays/show'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            HolidayController::class,
            'update',
            HolidayUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $holiday = Holiday::factory()->create();
        $date = fake()->date();
        $name = fake()->name();

        $response = $this->actingAs($this->admin)->put(route('holidays.update', $holiday), [
            'date' => $date,
            'name' => $name,
        ]);

        $response->assertSessionHasNoErrors();

        $holiday->refresh();

        $response->assertRedirect(route('holidays.index'));

        $this->assertEquals($date, $holiday->date->toDateString());
        $this->assertEquals($name, $holiday->name);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $holiday = Holiday::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('holidays.destroy', $holiday));

        $response->assertRedirect(route('holidays.index'));

        $this->assertModelMissing($holiday);
    }
}
