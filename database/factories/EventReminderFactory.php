<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventReminderFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'sent_by' => Employee::factory(),
            'channel' => fake()->randomElement(['email', 'whatsapp', 'sms', 'system']),
            'message' => fake()->text(),
            'sent_at' => fake()->dateTime(),
            'sent_by_id' => Employee::factory(),
        ];
    }
}
