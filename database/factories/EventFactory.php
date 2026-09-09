<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'slug' => fake()->slug(),
            'description' => fake()->text(),
            'objectives' => fake()->text(),
            'event_type' => fake()->randomElement(['seminar', 'workshop', 'training', 'conference', 'webinar', 'other']),
            'delivery_mode' => fake()->randomElement(['offline', 'online', 'hybrid']),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'start_time' => fake()->time(),
            'end_time' => fake()->time(),
            'venue' => fake()->word(),
            'online_platform' => fake()->word(),
            'online_link' => fake()->word(),
            'quota' => fake()->numberBetween(10, 100),
            'registration_deadline' => fake()->dateTime(),
            'cover_image' => fake()->word(),
            'banner_image' => fake()->word(),
            'status' => fake()->randomElement(['draft', 'published', 'ongoing', 'completed', 'cancelled']),
            'created_by' => Employee::factory(),
            'published_by' => Employee::factory(),
            'published_at' => fake()->dateTime(),
            'created_by_id' => Employee::factory(),
            'published_by_id' => Employee::factory(),
        ];
    }
}
