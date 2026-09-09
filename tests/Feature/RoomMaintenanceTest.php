<?php

use App\Models\Employee;
use App\Models\Permission;
use App\Models\Room;
use App\Models\RoomMaintenanceRequest;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();
    Employee::factory()->create(['id' => $this->user->id]);

    // Create required permissions
    Permission::findOrCreate('maintenance.view', 'web');
    Permission::findOrCreate('maintenance.manage', 'web');
    Permission::findOrCreate('room.approval', 'web');
});

test('user can submit room maintenance request', function () {
    $room = Room::factory()->create();

    $data = [
        'room_id' => $room->id,
        'issue_description' => 'Broken AC',
    ];

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.store'), $data)
        ->assertRedirect(route('room-maintenance-requests.index'));

    $this->assertDatabaseHas('room_maintenance_requests', [
        'room_id' => $room->id,
        'reported_by_id' => $this->user->id,
        'issue_description' => 'Broken AC',
        'status' => 'reported',
    ]);
});

test('user can view their own maintenance requests', function () {
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $this->user->id,
        'room_id' => $room->id,
        'issue_description' => 'My issue',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-maintenance-requests.index'))
        ->assertSuccessful()
        ->assertSee('My issue');
});

test('user without room permission cannot see others requests', function () {
    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'issue_description' => 'Other issue',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-maintenance-requests.index'))
        ->assertSuccessful()
        ->assertDontSee('Other issue');
});

test('user with room permission can see all requests', function () {
    $this->user->givePermissionTo('maintenance.view');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'issue_description' => 'Other issue',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-maintenance-requests.index'))
        ->assertSuccessful()
        ->assertSee('Other issue');
});

test('user with room permission can respond to request', function () {
    $this->user->givePermissionTo('maintenance.manage');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'reported',
    ]);

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.respond', $request->id), ['status' => 'accepted'])
        ->assertRedirect();

    $this->assertDatabaseHas('room_maintenance_requests', [
        'id' => $request->id,
        'status' => 'accepted',
    ]);
});

test('user with room permission can add logs', function () {
    $this->user->givePermissionTo('maintenance.manage');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'accepted',
    ]);

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.add-log', $request->id), [
            'log' => 'Working on it',
            'status' => 'in_progress',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('room_maintenance_request_logs', [
        'room_maintenance_request_id' => $request->id,
        'log' => 'Working on it',
        'status' => 'in_progress',
    ]);

    $this->assertDatabaseHas('room_maintenance_requests', [
        'id' => $request->id,
        'status' => 'in_progress',
    ]);
});

test('requester can verify finished maintenance', function () {
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $this->user->id,
        'room_id' => $room->id,
        'status' => 'resolved',
    ]);

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.verify', $request->id))
        ->assertRedirect();

    $this->assertDatabaseHas('room_maintenance_requests', [
        'id' => $request->id,
        'status' => 'verified',
    ]);
});

test('user can submit room maintenance request with photo upload', function () {
    Storage::fake('public');

    $room = Room::factory()->create();
    $file = UploadedFile::fake()->image('broken_ac.jpg');

    $data = [
        'room_id' => $room->id,
        'issue_description' => 'Broken AC',
        'photo' => $file,
    ];

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.store'), $data)
        ->assertRedirect(route('room-maintenance-requests.index'));

    $request = RoomMaintenanceRequest::firstWhere('room_id', $room->id);
    $this->assertNotNull($request);

    $this->assertDatabaseHas('room_maintenance_requests', [
        'room_id' => $room->id,
        'reported_by_id' => $this->user->id,
        'issue_description' => 'Broken AC',
        'status' => 'reported',
    ]);

    $this->assertDatabaseHas('room_maintenance_request_files', [
        'room_maintenance_request_id' => $request->id,
        'description' => 'Room maintenance request photo',
    ]);

    $maintenanceRequestFile = $request->roomMaintenanceRequestFiles()->first();
    Storage::disk('public')->assertExists($maintenanceRequestFile->file);
});

test('user with room.approval permission can see all requests on index', function () {
    $this->user->givePermissionTo('room.approval');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'issue_description' => 'Other issue to approve',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-maintenance-requests.index'))
        ->assertSuccessful()
        ->assertSee('Other issue to approve');
});

test('user with room.approval permission can respond to request', function () {
    $this->user->givePermissionTo('room.approval');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'reported',
    ]);

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.respond', $request->id), ['status' => 'accepted'])
        ->assertRedirect();

    $this->assertDatabaseHas('room_maintenance_requests', [
        'id' => $request->id,
        'status' => 'accepted',
    ]);
});

test('user with room.approval permission can add logs', function () {
    $this->user->givePermissionTo('room.approval');

    $otherUser = User::factory()->create();
    Employee::factory()->create(['id' => $otherUser->id]);
    $room = Room::factory()->create();
    $request = RoomMaintenanceRequest::factory()->create([
        'reported_by_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'accepted',
    ]);

    $this->actingAs($this->user)
        ->post(route('room-maintenance-requests.add-log', $request->id), [
            'log' => 'Approval work started',
            'status' => 'in_progress',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('room_maintenance_request_logs', [
        'room_maintenance_request_id' => $request->id,
        'log' => 'Approval work started',
        'status' => 'in_progress',
    ]);

    $this->assertDatabaseHas('room_maintenance_requests', [
        'id' => $request->id,
        'status' => 'in_progress',
    ]);
});
