<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventRegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
            'registration_number' => fake()->word(),
            'registered_at' => fake()->dateTime(),
            'attendance_status' => fake()->randomElement(['registered', 'attended', 'no_show', 'cancelled']),
            'notes' => fake()->text(),
            'ticket_number' => fake()->word(),
            'qr_code' => fake()->word(),
            'issued_at' => fake()->dateTime(),
            'certificate_number' => fake()->word(),
            'file_path' => fake()->word(),
            'generated_by' => Employee::factory(),
            'generated_at' => fake()->dateTime(),
        ];
    }
}
