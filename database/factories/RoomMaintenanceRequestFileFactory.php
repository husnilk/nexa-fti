<?php

namespace Database\Factories;

use App\Models\RoomMaintenanceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomMaintenanceRequestFileFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'room_maintenance_request_id' => RoomMaintenanceRequest::factory(),
            'file' => fake()->word(),
            'description' => fake()->text(),
        ];
    }
}
