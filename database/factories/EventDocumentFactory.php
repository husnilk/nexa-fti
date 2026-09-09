<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'title' => fake()->sentence(4),
            'document_type' => fake()->randomElement(['report', 'photo', 'proposal', 'minutes', 'attendance', 'other']),
            'file_path' => fake()->word(),
            'description' => fake()->text(),
            'uploaded_by' => Employee::factory(),
            'uploaded_at' => fake()->dateTime(),
            'u_id' => Employee::factory(),
        ];
    }
}
