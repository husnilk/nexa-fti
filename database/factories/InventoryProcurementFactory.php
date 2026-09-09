<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryProcurementFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'request_number' => 'PROC-'.$this->faker->unique()->bothify('####-??'),
            'title' => $this->faker->sentence(4),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'approved', 'rejected']),
            'created_by' => Employee::factory(),
            'created_by_id' => function (array $attributes) {
                return $attributes['created_by'];
            },
            'approved_at' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => now(),
        ]);
    }
}
