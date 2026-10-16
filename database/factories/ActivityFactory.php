<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Period;
use App\Models\Rubric;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'period_id' => Period::factory(),
            'rubric_id' => Rubric::factory(),
            'name' => fake()->randomElement([
                'Panitia Seminar Nasional Teknologi Informasi',
                'Pembimbingan Tugas Akhir Semester Ganjil',
                'Tim Penyusun Borang Akreditasi',
                'Pengelola Jurnal Fakultas',
            ]),
            'document_number' => 'SK/'.fake()->numerify('###').'/UN16.15/'.fake()->year(),
            'form_type' => 0,
            'shared_performance_evidence' => false,
        ];
    }

    public function sharedEvidence(): static
    {
        return $this->state(fn (array $attributes) => [
            'shared_performance_evidence' => true,
            'performance_evidence_link' => 'https://drive.example.test/shared-evidence',
        ]);
    }
}
