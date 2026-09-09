<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'request_number' => 'REQ-'.$this->faker->unique()->bothify('####-??'),
            'employee_id' => Employee::factory(),
            'request_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'fulfilled']),
            'approved_by' => null,
            'approved_at' => null,
            'approved_by_id' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => Employee::factory(),
            'approved_by_id' => function (array $attributes) {
                return $attributes['approved_by'];
            },
            'approved_at' => now(),
        ]);
    }
}
