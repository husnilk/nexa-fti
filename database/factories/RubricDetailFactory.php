<?php

namespace Database\Factories;

use App\Models\Rubric;
use App\Models\RubricDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RubricDetail>
 */
class RubricDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rubric_id' => Rubric::factory(),
            'position' => fake()->randomElement(['Ketua', 'Anggota', 'Sekretaris', 'Penulis Utama']),
            'poin' => fake()->randomFloat(2, 1, 100),
        ];
    }
}
