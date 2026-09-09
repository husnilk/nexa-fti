<?php

use App\Models\Employee;
use App\Models\Permission;
use App\Models\Room;
use App\Models\RoomUsage;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->user = User::factory()->create();
    Employee::factory()->create(['id' => $this->user->id]);

    // Create required permissions
    Permission::findOrCreate('room.request', 'web');
    Permission::findOrCreate('room.view', 'web');
    Permission::findOrCreate('room.manage', 'web');

    $this->user->givePermissionTo('room.request');
});

test('user can propose room usage for a public room', function () {
    $this->withoutExceptionHandling();
    $room = Room::factory()->create(['is_public' => true]);

    $data = [
        'room_id' => $room->id,
        'start_time' => now()->addDay()->format('Y-m-d H:i:s'),
        'end_time' => now()->addDay()->addHours(2)->format('Y-m-d H:i:s'),
        'purpose' => 'Test usage',
    ];

    $this->actingAs($this->user)
        ->postJson(route('room-usages.store'), $data)
        ->assertRedirect(route('room-usages.index'));

    $this->assertDatabaseHas('room_usages', [
        'room_id' => $room->id,
        'user_id' => $this->user->id,
        'purpose' => 'Test usage',
        'status' => 'requested',
    ]);
});

test('user cannot propose room usage for a private room', function () {
    $room = Room::factory()->create(['is_public' => false]);

    $data = [
        'room_id' => $room->id,
        'start_time' => now()->addDay()->format('Y-m-d H:i:s'),
        'end_time' => now()->addDay()->addHours(2)->format('Y-m-d H:i:s'),
        'purpose' => 'Test usage',
    ];

    $this->actingAs($this->user)
        ->from(route('room-usages.create'))
        ->postJson(route('room-usages.store'), $data)
        ->assertRedirect(route('room-usages.create'))
        ->assertSessionHasErrors(['room_id']);
});

test('user can view their own room usages', function () {
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $this->user->id,
        'room_id' => $room->id,
    ]);

    $this->actingAs($this->user)
        ->get(route('room-usages.index'))
        ->assertSuccessful()
        ->assertSee($usage->purpose);
});

test('user without room permission cannot view others room usages', function () {
    $otherUser = User::factory()->create();
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'purpose' => 'Other users purpose',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-usages.index'))
        ->assertSuccessful()
        ->assertDontSee($usage->purpose);
});

test('user with room permission can view all room usages', function () {
    $this->user->givePermissionTo('room.view');

    $otherUser = User::factory()->create();
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'purpose' => 'Other users purpose',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-usages.index'))
        ->assertSuccessful()
        ->assertSee($usage->purpose);
});

test('user with room permission can approve a proposal', function () {
    $this->user->givePermissionTo('room.manage');

    $otherUser = User::factory()->create();
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->postJson(route('room-usages.approve', $usage->id))
        ->assertRedirect();

    $this->assertDatabaseHas('room_usages', [
        'id' => $usage->id,
        'status' => 'approved',
        'approved_by_id' => $this->user->id,
    ]);
});

test('user without room permission cannot approve a proposal', function () {
    $otherUser = User::factory()->create();
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->postJson(route('room-usages.approve', $usage->id))
        ->assertForbidden();
});

test('user with room permission can reject a proposal', function () {
    $this->user->givePermissionTo('room.manage');

    $otherUser = User::factory()->create();
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'status' => 'requested',
    ]);

    $this->actingAs($this->user)
        ->postJson(route('room-usages.reject', $usage->id))
        ->assertRedirect();

    $this->assertDatabaseHas('room_usages', [
        'id' => $usage->id,
        'status' => 'rejected',
        'approved_by_id' => $this->user->id,
    ]);
});

test('user without room.request permission cannot view room usages', function () {
    $this->user->revokePermissionTo('room.request');

    $this->actingAs($this->user)
        ->get(route('room-usages.index'))
        ->assertForbidden();
});

test('user without room.request permission cannot propose room usage', function () {
    $this->user->revokePermissionTo('room.request');
    $room = Room::factory()->create(['is_public' => true]);

    $data = [
        'room_id' => $room->id,
        'start_time' => now()->addDay()->format('Y-m-d H:i:s'),
        'end_time' => now()->addDay()->addHours(2)->format('Y-m-d H:i:s'),
        'purpose' => 'Test usage',
    ];

    $this->actingAs($this->user)
        ->postJson(route('room-usages.store'), $data)
        ->assertForbidden();
});

test('all users can view room usage report', function () {
    $this->user->revokePermissionTo('room.request');
    $room = Room::factory()->create(['is_public' => true]);
    $usage = RoomUsage::factory()->create([
        'room_id' => $room->id,
        'status' => 'approved',
        'purpose' => 'Public Meeting',
    ]);

    $this->actingAs($this->user)
        ->get(route('room-usages.report', ['room_id' => $room->id]))
        ->assertSuccessful()
        ->assertSee($room->name);
});
