<?php

namespace Database\Factories;

use App\Models\Training;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Training>
 */
class TrainingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-1 year', 'now');
        $endDate = (clone $startDate)->modify('+'.rand(1, 7).' days');

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph,
            'provider' => $this->faker->company,
            'location' => $this->faker->city,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'hours' => $this->faker->numberBetween(8, 40),
            'certificate_file' => null,
        ];
    }
}
