<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\FunctionalPosition;
use App\Models\Lecturer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lecturer>
 */
class LecturerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Employee::factory(),
            'academic_rank' => fake()->randomElement(['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Profesor']),
            'functional_position_id' => FunctionalPosition::factory(),
            'nuptk' => fake()->numerify('################'),
            'expertise' => fake()->sentence(),
        ];
    }
}
