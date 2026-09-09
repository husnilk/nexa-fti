<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\CommitteeController;
use App\Http\Requests\CommitteeStoreRequest;
use App\Http\Requests\CommitteeUpdateRequest;
use App\Models\Committee;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see CommitteeController
 */
final class CommitteeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Permission::findOrCreate('committee.view', 'web');
        Permission::findOrCreate('committee.manage', 'web');
        $this->user->givePermissionTo(['committee.view', 'committee.manage']);
        $this->actingAs($this->user);
    }

    #[Test]
    public function index_displays_view(): void
    {
        $committees = Committee::factory()->count(3)->create();

        $response = $this->get(route('committees.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/index'));
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('committees.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/create'));
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeController::class,
            'store',
            CommitteeStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $code = fake()->unique()->lexify('COM-????');
        $name = fake()->name();
        $start_date = Carbon::parse(fake()->date());
        $end_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'active', 'completed', 'cancelled']);
        $chairman_id = Employee::factory()->create();
        $sponsor_unit_id = Organization::factory()->create();

        $response = $this->post(route('committees.store'), [
            'code' => $code,
            'name' => $name,
            'start_date' => $start_date->toDateString(),
            'end_date' => $end_date->toDateString(),
            'status' => $status,
            'chairman_id' => $chairman_id->id,
            'organization_id' => $sponsor_unit_id->id,
            'chairman_id_id' => '0',
            'sponsor_unit_id_id' => '0',
        ]);

        $committees = Committee::query()
            ->where('code', $code)
            ->where('name', $name)
            ->where('start_date', $start_date)
            ->where('end_date', $end_date)
            ->where('status', $status)
            ->where('chairman_id', $chairman_id->id)
            ->where('organization_id', $sponsor_unit_id->id)
            ->get();
        $this->assertCount(1, $committees);
        $committee = $committees->first();

        $response->assertRedirect(route('committees.index'));
        $response->assertSessionHas('committee.id', $committee->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $committee = Committee::factory()->create();

        $response = $this->get(route('committees.show', $committee));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/show'));
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $committee = Committee::factory()->create();

        $response = $this->get(route('committees.edit', $committee));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('committees/edit'));
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            CommitteeController::class,
            'update',
            CommitteeUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $committee = Committee::factory()->create();
        $code = fake()->unique()->lexify('COM-????');
        $name = fake()->name();
        $start_date = Carbon::parse(fake()->date());
        $end_date = Carbon::parse(fake()->date());
        $status = fake()->randomElement(['draft', 'active', 'completed', 'cancelled']);
        $chairman_id = Employee::factory()->create();
        $sponsor_unit_id = Organization::factory()->create();

        $response = $this->put(route('committees.update', $committee), [
            'code' => $code,
            'name' => $name,
            'start_date' => $start_date->toDateString(),
            'end_date' => $end_date->toDateString(),
            'status' => $status,
            'chairman_id' => $chairman_id->id,
            'organization_id' => $sponsor_unit_id->id,
            'chairman_id_id' => '0',
            'sponsor_unit_id_id' => '0',
        ]);

        $committee->refresh();

        $response->assertRedirect(route('committees.index'));
        $response->assertSessionHas('committee.id', $committee->id);

        $this->assertEquals($code, $committee->code);
        $this->assertEquals($name, $committee->name);
        $this->assertEquals($start_date->toDateString(), $committee->start_date->toDateString());
        $this->assertEquals($end_date->toDateString(), $committee->end_date->toDateString());
        $this->assertEquals($status, $committee->status);
        $this->assertEquals($chairman_id->id, $committee->chairman_id);
        $this->assertEquals($sponsor_unit_id->id, $committee->organization_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $committee = Committee::factory()->create();

        $response = $this->delete(route('committees.destroy', $committee));

        $response->assertRedirect(route('committees.index'));

        $this->assertModelMissing($committee);
    }
}
