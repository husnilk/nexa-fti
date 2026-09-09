<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'title' => fake()->sentence(4),
            'document_type' => fake()->randomElement(['invoice', 'warranty', 'manual', 'photo', 'other']),
            'file_path' => fake()->word(),
            'uploaded_by' => Employee::factory(),
            'uploaded_at' => fake()->dateTime(),
            'uploaded_by_id' => Employee::factory(),
        ];
    }
}
