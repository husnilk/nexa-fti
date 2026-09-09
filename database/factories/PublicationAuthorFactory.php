<?php

namespace Database\Factories;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PublicationAuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'publication_id' => Publication::factory(),
            'author_id' => User::factory(),
            'author_order' => fake()->numberBetween(-10000, 10000),
            'is_corresponding' => fake()->boolean(),
            'user_id' => User::factory(),
        ];
    }
}
