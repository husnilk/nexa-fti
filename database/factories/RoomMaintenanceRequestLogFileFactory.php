<?php

namespace Database\Factories;

use App\Models\RoomMaintenanceRequestLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomMaintenanceRequestLogFileFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'room_maintenance_request_log_id' => RoomMaintenanceRequestLog::factory(),
            'file' => fake()->word(),
            'description' => fake()->text(),
        ];
    }
}
