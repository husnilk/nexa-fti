<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDisposalFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'disposal_number' => fake()->word(),
            'disposal_date' => fake()->date(),
            'title' => fake()->sentence(4),
            'reason' => fake()->text(),
            'disposal_method' => fake()->randomElement(['sold', 'donated', 'scrapped', 'lost', 'mutation']),
            'status' => fake()->randomElement(['draft', 'pending', 'approved', 'rejected', 'completed']),
            'proposed_by' => Employee::factory(),
            'approved_by' => Employee::factory(),
            'approved_at' => fake()->dateTime(),
            'notes' => fake()->text(),
            'proposed_by_id' => Employee::factory(),
            'approved_by_id' => Employee::factory(),
        ];
    }
}
