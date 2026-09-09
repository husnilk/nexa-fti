<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'title' => fake()->sentence(4),
            'agenda' => fake()->text(),
            'meeting_type' => fake()->randomElement(['offline', 'online', 'hybrid']),
            'meeting_date' => fake()->date(),
            'start_time' => fake()->time(),
            'end_time' => fake()->time(),
            'room_id' => Room::factory(),
            'online_platform' => fake()->word(),
            'online_link' => fake()->word(),
            'organizer_id' => Employee::factory(),
            'chairman_id' => Employee::factory(),
            'status' => fake()->randomElement(['draft', 'scheduled', 'completed', 'cancelled']),
            'is_confidential' => fake()->boolean(),
            'organizer_id_id' => Employee::factory(),
            'chairman_id_id' => Employee::factory(),
        ];
    }
}
