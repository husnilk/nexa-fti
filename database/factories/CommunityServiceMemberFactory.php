<?php

namespace Database\Factories;

use App\Models\CommunityService;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityServiceMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'community_service_id' => CommunityService::factory(),
            'user_id' => User::factory(),
            'role' => fake()->word(),
        ];
    }
}
