<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_id' => Committee::factory(),
            'title' => fake()->sentence(4),
            'document_type' => fake()->randomElement(['proposal', 'tor', 'budget', 'report', 'photo', 'certificate', 'other']),
            'file_path' => fake()->word(),
            'uploaded_by' => Employee::factory(),
            'uploaded_at' => fake()->dateTime(),
            'uploaded_by_id' => Employee::factory(),
        ];
    }
}
