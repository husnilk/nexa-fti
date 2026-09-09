<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EventCommitteeMemberController;
use App\Http\Requests\EventCommitteeMemberStoreRequest;
use App\Http\Requests\EventCommitteeMemberUpdateRequest;
use App\Models\Employee;
use App\Models\Event;
use App\Models\EventCommitteeMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EventCommitteeMemberController
 */
final class EventCommitteeMemberControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $eventCommitteeMembers = EventCommitteeMember::factory()->count(3)->create();

        $response = $this->get(route('event-committee-members.index'));

        $response->assertOk();
        $response->assertViewIs('eventCommitteeMember.index');
        $response->assertViewHas('eventCommitteeMembers', $eventCommitteeMembers);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('event-committee-members.create'));

        $response->assertOk();
        $response->assertViewIs('eventCommitteeMember.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventCommitteeMemberController::class,
            'store',
            EventCommitteeMemberStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $event = Event::factory()->create();
        $employee = Employee::factory()->create();
        $role = fake()->word();
        $is_leader = fake()->boolean();

        $response = $this->post(route('event-committee-members.store'), [
            'event_id' => $event->id,
            'employee_id' => $employee->id,
            'role' => $role,
            'is_leader' => $is_leader,
        ]);

        $eventCommitteeMembers = EventCommitteeMember::query()
            ->where('event_id', $event->id)
            ->where('employee_id', $employee->id)
            ->where('role', $role)
            ->where('is_leader', $is_leader)
            ->get();
        $this->assertCount(1, $eventCommitteeMembers);
        $eventCommitteeMember = $eventCommitteeMembers->first();

        $response->assertRedirect(route('event-committee-members.index'));
        $response->assertSessionHas('eventCommitteeMember.id', $eventCommitteeMember->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $eventCommitteeMember = EventCommitteeMember::factory()->create();

        $response = $this->get(route('event-committee-members.show', $eventCommitteeMember));

        $response->assertOk();
        $response->assertViewIs('eventCommitteeMember.show');
        $response->assertViewHas('eventCommitteeMember', $eventCommitteeMember);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $eventCommitteeMember = EventCommitteeMember::factory()->create();

        $response = $this->get(route('event-committee-members.edit', $eventCommitteeMember));

        $response->assertOk();
        $response->assertViewIs('eventCommitteeMember.edit');
        $response->assertViewHas('eventCommitteeMember', $eventCommitteeMember);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EventCommitteeMemberController::class,
            'update',
            EventCommitteeMemberUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $eventCommitteeMember = EventCommitteeMember::factory()->create();
        $event = Event::factory()->create();
        $employee = Employee::factory()->create();
        $role = fake()->word();
        $is_leader = fake()->boolean();

        $response = $this->put(route('event-committee-members.update', $eventCommitteeMember), [
            'event_id' => $event->id,
            'employee_id' => $employee->id,
            'role' => $role,
            'is_leader' => $is_leader,
        ]);

        $eventCommitteeMember->refresh();

        $response->assertRedirect(route('event-committee-members.index'));
        $response->assertSessionHas('eventCommitteeMember.id', $eventCommitteeMember->id);

        $this->assertEquals($event->id, $eventCommitteeMember->event_id);
        $this->assertEquals($employee->id, $eventCommitteeMember->employee_id);
        $this->assertEquals($role, $eventCommitteeMember->role);
        $this->assertEquals($is_leader, $eventCommitteeMember->is_leader);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $eventCommitteeMember = EventCommitteeMember::factory()->create();

        $response = $this->delete(route('event-committee-members.destroy', $eventCommitteeMember));

        $response->assertRedirect(route('event-committee-members.index'));

        $this->assertModelMissing($eventCommitteeMember);
    }
}
