<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingMinuteFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'version' => fake()->numberBetween(-10000, 10000),
            'summary' => fake()->text(),
            'decisions' => fake()->text(),
            'next_actions' => fake()->text(),
            'prepared_by' => Employee::factory(),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'is_final' => fake()->boolean(),
            'file_upload' => fake()->word(),
            'prepared_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
