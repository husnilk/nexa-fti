<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomMaintenanceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'issue_description' => fake()->text(),
            'status' => fake()->randomElement(['reported', 'accepted', 'rejected', 'in_progress', 'resolved', 'verified']),
            'reported_at' => fake()->dateTime(),
            'resolved_at' => fake()->dateTime(),
            'reported_by_id' => Employee::factory(),
        ];
    }
}
