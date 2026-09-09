<?php

namespace Database\Factories;

use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingExternalParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'name' => fake()->name(),
            'institution' => fake()->word(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'role' => fake()->randomElement(['participant', 'speaker', 'guest']),
            'attendance_status' => fake()->randomElement(['invited', 'attended', 'absent']),
            'check_in_time' => fake()->dateTime(),
            'check_out_time' => fake()->dateTime(),
            'attendance_method' => fake()->randomElement(['manual', 'qr_scan']),
        ];
    }
}
