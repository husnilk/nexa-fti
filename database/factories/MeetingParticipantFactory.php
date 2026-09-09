<?php

namespace Database\Factories;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'user_id' => User::factory(),
            'role' => fake()->randomElement(['participant', 'moderator', 'speaker', 'note_taker']),
            'attendance_status' => fake()->randomElement(['invited', 'attended', 'absent']),
            'check_in_time' => fake()->dateTime(),
            'check_out_time' => fake()->dateTime(),
            'attendance_method' => fake()->randomElement(['manual', 'qr_scan']),
            'notes' => fake()->text(),
        ];
    }
}
