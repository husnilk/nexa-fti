<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingRefreshmentRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'requested_by' => Employee::factory(),
            'request_date' => fake()->date(),
            'participant_count' => fake()->numberBetween(-10000, 10000),
            'notes' => fake()->text(),
            'status' => fake()->randomElement(['draft', 'pending', 'approved', 'rejected', 'fulfilled']),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'requested_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
