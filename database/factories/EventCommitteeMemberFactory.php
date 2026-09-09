<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventCommitteeMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'employee_id' => Employee::factory(),
            'role' => fake()->word(),
            'is_leader' => fake()->boolean(),
        ];
    }
}
