<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentRevisionFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'revision_no' => fake()->numberBetween(1, 10),
            'revision_date' => fake()->date(),
            'doc_date' => fake()->numberBetween(1, 28),
            'doc_month' => fake()->numberBetween(1, 12),
            'doc_year' => fake()->numberBetween(2020, 2026),
            'active' => true,
            'file_path' => 'documents/'.fake()->word().'.pdf',
            'uploaded_by' => Employee::factory(),
            'uploaded_at' => now(),
            'uploaded_by_id' => Employee::factory(),
        ];
    }
}
