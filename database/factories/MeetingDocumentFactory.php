<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'title' => fake()->sentence(4),
            'document_type' => fake()->randomElement(['photo', 'minutes', 'presentation', 'recording', 'attendance', 'other']),
            'file_path' => fake()->word(),
            'uploaded_by' => Employee::factory(),
            'uploaded_at' => fake()->dateTime(),
            'uploaded_by_id' => Employee::factory(),
        ];
    }
}
