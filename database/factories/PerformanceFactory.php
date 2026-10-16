<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Employee;
use App\Models\Performance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Performance>
 */
class PerformanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'activity_id' => Activity::factory(),
            'position' => 'Anggota',
            'quantity' => 1,
            'points' => fake()->randomFloat(2, 1, 20),
        ];
    }
}
