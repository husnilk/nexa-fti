<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\LeaveTypeController;
use App\Http\Requests\LeaveTypeControllerStoreRequest;
use App\Http\Requests\LeaveTypeControllerUpdateRequest;
use App\Models\LeaveType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see LeaveTypeController
 */
final class LeaveTypeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $leaveTypes = LeaveType::factory()->count(3)->create();

        $response = $this->get(route('leave-types.index'));

        $response->assertOk();
        $response->assertViewIs('leaveType.index');
        $response->assertViewHas('leaveTypes', $leaveTypes);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('leave-types.create'));

        $response->assertOk();
        $response->assertViewIs('leaveType.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            LeaveTypeController::class,
            'store',
            LeaveTypeControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $name = fake()->name();
        $code = fake()->word();
        $default_quota = fake()->numberBetween(-10000, 10000);
        $requires_attachment = fake()->boolean();

        $response = $this->post(route('leave-types.store'), [
            'name' => $name,
            'code' => $code,
            'default_quota' => $default_quota,
            'requires_attachment' => $requires_attachment,
        ]);

        $leaveTypes = LeaveType::query()
            ->where('name', $name)
            ->where('code', $code)
            ->where('default_quota', $default_quota)
            ->where('requires_attachment', $requires_attachment)
            ->get();
        $this->assertCount(1, $leaveTypes);
        $leaveType = $leaveTypes->first();

        $response->assertRedirect(route('leaveTypes.index'));
        $response->assertSessionHas('leaveType.id', $leaveType->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $leaveType = LeaveType::factory()->create();

        $response = $this->get(route('leave-types.show', $leaveType));

        $response->assertOk();
        $response->assertViewIs('leaveType.show');
        $response->assertViewHas('leaveType', $leaveType);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $leaveType = LeaveType::factory()->create();

        $response = $this->get(route('leave-types.edit', $leaveType));

        $response->assertOk();
        $response->assertViewIs('leaveType.edit');
        $response->assertViewHas('leaveType', $leaveType);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            LeaveTypeController::class,
            'update',
            LeaveTypeControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $leaveType = LeaveType::factory()->create();
        $name = fake()->name();
        $code = fake()->word();
        $default_quota = fake()->numberBetween(-10000, 10000);
        $requires_attachment = fake()->boolean();

        $response = $this->put(route('leave-types.update', $leaveType), [
            'name' => $name,
            'code' => $code,
            'default_quota' => $default_quota,
            'requires_attachment' => $requires_attachment,
        ]);

        $leaveType->refresh();

        $response->assertRedirect(route('leaveTypes.index'));
        $response->assertSessionHas('leaveType.id', $leaveType->id);

        $this->assertEquals($name, $leaveType->name);
        $this->assertEquals($code, $leaveType->code);
        $this->assertEquals($default_quota, $leaveType->default_quota);
        $this->assertEquals($requires_attachment, $leaveType->requires_attachment);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $leaveType = LeaveType::factory()->create();

        $response = $this->delete(route('leave-types.destroy', $leaveType));

        $response->assertRedirect(route('leaveTypes.index'));

        $this->assertModelMissing($leaveType);
    }
}
