<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\RoomUsageController;
use App\Http\Requests\RoomUsageControllerStoreRequest;
use App\Http\Requests\RoomUsageControllerUpdateRequest;
use App\Models\Employee;
use App\Models\Room;
use App\Models\RoomUsage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see RoomUsageController
 */
final class RoomUsageControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $roomUsages = RoomUsage::factory()->count(3)->create();

        $response = $this->get(route('room-usages.index'));

        $response->assertOk();
        $response->assertViewIs('roomUsage.index');
        $response->assertViewHas('roomUsages', $roomUsages);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('room-usages.create'));

        $response->assertOk();
        $response->assertViewIs('roomUsage.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomUsageController::class,
            'store',
            RoomUsageControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $room = Room::factory()->create();
        $user = User::factory()->create();
        $start_time = Carbon::parse(fake()->dateTime());
        $end_time = Carbon::parse(fake()->dateTime());
        $status = fake()->randomElement(/** enum_attributes **/);
        $approved_by = Employee::factory()->create();

        $response = $this->post(route('room-usages.store'), [
            'room_id' => $room->id,
            'user_id' => $user->id,
            'start_time' => $start_time->toDateTimeString(),
            'end_time' => $end_time->toDateTimeString(),
            'status' => $status,
            'approved_by_id' => $approved_by->id,
        ]);

        $roomUsages = RoomUsage::query()
            ->where('room_id', $room->id)
            ->where('user_id', $user->id)
            ->where('start_time', $start_time)
            ->where('end_time', $end_time)
            ->where('status', $status)
            ->where('approved_by_id', $approved_by->id)
            ->get();
        $this->assertCount(1, $roomUsages);
        $roomUsage = $roomUsages->first();

        $response->assertRedirect(route('roomUsages.index'));
        $response->assertSessionHas('roomUsage.id', $roomUsage->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $roomUsage = RoomUsage::factory()->create();

        $response = $this->get(route('room-usages.show', $roomUsage));

        $response->assertOk();
        $response->assertViewIs('roomUsage.show');
        $response->assertViewHas('roomUsage', $roomUsage);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $roomUsage = RoomUsage::factory()->create();

        $response = $this->get(route('room-usages.edit', $roomUsage));

        $response->assertOk();
        $response->assertViewIs('roomUsage.edit');
        $response->assertViewHas('roomUsage', $roomUsage);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            RoomUsageController::class,
            'update',
            RoomUsageControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $roomUsage = RoomUsage::factory()->create();
        $room = Room::factory()->create();
        $user = User::factory()->create();
        $start_time = Carbon::parse(fake()->dateTime());
        $end_time = Carbon::parse(fake()->dateTime());
        $status = fake()->randomElement(/** enum_attributes **/);
        $approved_by = Employee::factory()->create();

        $response = $this->put(route('room-usages.update', $roomUsage), [
            'room_id' => $room->id,
            'user_id' => $user->id,
            'start_time' => $start_time->toDateTimeString(),
            'end_time' => $end_time->toDateTimeString(),
            'status' => $status,
            'approved_by_id' => $approved_by->id,
        ]);

        $roomUsage->refresh();

        $response->assertRedirect(route('roomUsages.index'));
        $response->assertSessionHas('roomUsage.id', $roomUsage->id);

        $this->assertEquals($room->id, $roomUsage->room_id);
        $this->assertEquals($user->id, $roomUsage->user_id);
        $this->assertEquals($start_time, $roomUsage->start_time);
        $this->assertEquals($end_time, $roomUsage->end_time);
        $this->assertEquals($status, $roomUsage->status);
        $this->assertEquals($approved_by->id, $roomUsage->approved_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $roomUsage = RoomUsage::factory()->create();

        $response = $this->delete(route('room-usages.destroy', $roomUsage));

        $response->assertRedirect(route('roomUsages.index'));

        $this->assertModelMissing($roomUsage);
    }
}
