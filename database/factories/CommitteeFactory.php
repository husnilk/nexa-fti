<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->lexify('COM-????'),
            'name' => fake()->name(),
            'objective' => fake()->text(),
            'expected_outcome' => fake()->text(),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'status' => fake()->randomElement(['draft', 'active', 'completed', 'cancelled']),
            'chairman_id' => Employee::factory(),
            'organization_id' => Organization::factory(),
            'description' => fake()->text(),
            'chairman_id_id' => Employee::factory(),
            'sponsor_unit_id_id' => Organization::factory(),
        ];
    }
}
