<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventAttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'event_registration_id' => EventRegistration::factory(),
            'checked_in_at' => fake()->dateTime(),
            'checked_out_at' => fake()->dateTime(),
            'checked_by' => Employee::factory(),
            'attendance_method' => fake()->randomElement(['manual', 'qr_scan', 'system']),
            'status' => fake()->randomElement(['present', 'absent', 'partial']),
            'event_id' => Event::factory(),
            'checked_by_id' => Employee::factory(),
        ];
    }
}
