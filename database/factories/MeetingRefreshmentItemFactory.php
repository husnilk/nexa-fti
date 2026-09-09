<?php

namespace Database\Factories;

use App\Models\MeetingRefreshmentRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingRefreshmentItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'meeting_refreshment_request_id' => MeetingRefreshmentRequest::factory(),
            'item_name' => fake()->word(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'estimated_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'notes' => fake()->text(),
        ];
    }
}
