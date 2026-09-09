<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomUsageFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'user_id' => User::factory(),
            'start_time' => fake()->dateTime(),
            'end_time' => fake()->dateTime(),
            'purpose' => fake()->word(),
            'status' => fake()->randomElement(['requested', 'approved', 'rejected', 'completed']),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
