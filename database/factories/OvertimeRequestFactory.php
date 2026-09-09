<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class OvertimeRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'request_number' => 'OT-'.fake()->unique()->numerify('####'),
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'request_date' => fake()->date(),
            'planned_start_time' => $start = fake()->dateTimeBetween('now', '+1 week'),
            'planned_end_time' => fake()->dateTimeBetween($start, '+1 week'),
            'submitted_by' => Employee::factory(),
            'approved_by' => null,
            'status' => 'draft',
            'submitted_at' => null,
            'approved_at' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'submitted_at' => now(),
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => Employee::factory(),
            'approved_at' => now(),
            'submitted_at' => now(),
        ]);
    }
}
