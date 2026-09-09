<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\RoomMaintenanceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomMaintenanceRequestLogFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'room_maintenance_request_id' => RoomMaintenanceRequest::factory(),
            'log' => fake()->text(),
            'logged_at' => fake()->dateTime(),
            'logged_file' => fake()->word(),
            'verified_at' => fake()->dateTime(),
            'verification_file' => fake()->word(),
            'description' => fake()->text(),
            'status' => fake()->randomElement(['reported', 'accepted', 'rejected', 'in_progress', 'resolved', 'verified']),
            'logged_by_id' => Employee::factory(),
            'verified_by_id' => Employee::factory(),
        ];
    }
}
