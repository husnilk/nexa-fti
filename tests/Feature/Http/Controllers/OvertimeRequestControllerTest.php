<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\OvertimeRequestController;
use App\Http\Requests\OvertimeRequestControllerStoreRequest;
use App\Http\Requests\OvertimeRequestControllerUpdateRequest;
use App\Models\Employee;
use App\Models\OvertimeRequest;
use App\Models\SubmittedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see OvertimeRequestController
 */
final class OvertimeRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $overtimeRequests = OvertimeRequest::factory()->count(3)->create();

        $response = $this->get(route('overtime-requests.index'));

        $response->assertOk();
        $response->assertViewIs('overtimeRequest.index');
        $response->assertViewHas('overtimeRequests', $overtimeRequests);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('overtime-requests.create'));

        $response->assertOk();
        $response->assertViewIs('overtimeRequest.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeRequestController::class,
            'store',
            OvertimeRequestControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $request_number = fake()->word();
        $title = fake()->sentence(4);
        $request_date = Carbon::parse(fake()->date());
        $planned_start_time = Carbon::parse(fake()->dateTime());
        $planned_end_time = Carbon::parse(fake()->dateTime());
        $submitted_by = SubmittedBy::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $submitted_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('overtime-requests.store'), [
            'request_number' => $request_number,
            'title' => $title,
            'request_date' => $request_date->toDateString(),
            'planned_start_time' => $planned_start_time->toDateTimeString(),
            'planned_end_time' => $planned_end_time->toDateTimeString(),
            'submitted_by' => $submitted_by->id,
            'status' => $status,
            'submitted_by_id' => $submitted_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $overtimeRequests = OvertimeRequest::query()
            ->where('request_number', $request_number)
            ->where('title', $title)
            ->where('request_date', $request_date)
            ->where('planned_start_time', $planned_start_time)
            ->where('planned_end_time', $planned_end_time)
            ->where('submitted_by', $submitted_by->id)
            ->where('status', $status)
            ->where('submitted_by_id', $submitted_by->id)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $overtimeRequests);
        $overtimeRequest = $overtimeRequests->first();

        $response->assertRedirect(route('overtimeRequests.index'));
        $response->assertSessionHas('overtimeRequest.id', $overtimeRequest->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $overtimeRequest = OvertimeRequest::factory()->create();

        $response = $this->get(route('overtime-requests.show', $overtimeRequest));

        $response->assertOk();
        $response->assertViewIs('overtimeRequest.show');
        $response->assertViewHas('overtimeRequest', $overtimeRequest);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $overtimeRequest = OvertimeRequest::factory()->create();

        $response = $this->get(route('overtime-requests.edit', $overtimeRequest));

        $response->assertOk();
        $response->assertViewIs('overtimeRequest.edit');
        $response->assertViewHas('overtimeRequest', $overtimeRequest);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            OvertimeRequestController::class,
            'update',
            OvertimeRequestControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $overtimeRequest = OvertimeRequest::factory()->create();
        $request_number = fake()->word();
        $title = fake()->sentence(4);
        $request_date = Carbon::parse(fake()->date());
        $planned_start_time = Carbon::parse(fake()->dateTime());
        $planned_end_time = Carbon::parse(fake()->dateTime());
        $submitted_by = SubmittedBy::factory()->create();
        $status = fake()->randomElement(/** enum_attributes **/);
        $submitted_by = Employee::factory()->create();
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('overtime-requests.update', $overtimeRequest), [
            'request_number' => $request_number,
            'title' => $title,
            'request_date' => $request_date->toDateString(),
            'planned_start_time' => $planned_start_time->toDateTimeString(),
            'planned_end_time' => $planned_end_time->toDateTimeString(),
            'submitted_by' => $submitted_by->id,
            'status' => $status,
            'submitted_by_id' => $submitted_by->id,
            'approved_by_id' => $approved_by->id,
        ]);

        $overtimeRequest->refresh();

        $response->assertRedirect(route('overtimeRequests.index'));
        $response->assertSessionHas('overtimeRequest.id', $overtimeRequest->id);

        $this->assertEquals($request_number, $overtimeRequest->request_number);
        $this->assertEquals($title, $overtimeRequest->title);
        $this->assertEquals($request_date, $overtimeRequest->request_date);
        $this->assertEquals($planned_start_time, $overtimeRequest->planned_start_time);
        $this->assertEquals($planned_end_time, $overtimeRequest->planned_end_time);
        $this->assertEquals($submitted_by->id, $overtimeRequest->submitted_by);
        $this->assertEquals($status, $overtimeRequest->status);
        $this->assertEquals($submitted_by->id, $overtimeRequest->submitted_by_id);
        $this->assertEquals($approved_by->id, $overtimeRequest->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $overtimeRequest = OvertimeRequest::factory()->create();

        $response = $this->delete(route('overtime-requests.destroy', $overtimeRequest));

        $response->assertRedirect(route('overtimeRequests.index'));

        $this->assertModelMissing($overtimeRequest);
    }
}
