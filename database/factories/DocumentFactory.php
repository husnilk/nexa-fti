<?php

namespace Database\Factories;

use App\Models\DocumentType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'document_type_id' => DocumentType::factory(),
            'organisation_id' => Organization::factory(),
            'document_no' => fake()->word(),
            'publish_status' => 'draft',
            'published_by' => null,
            'published_at' => null,
            'archived_by' => null,
            'archived_at' => null,
            'published_by_id' => null,
            'archived_by_id' => null,
        ];
    }
}
