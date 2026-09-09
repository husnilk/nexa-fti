<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\OrganizationPosition;
use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrganizationPosition>
 */
class OrganizationPositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'position_id' => Position::factory(),
            'grade' => fake()->numberBetween(1, 15),
            'job_value' => fake()->numberBetween(100, 1000),
            'cg' => fake()->numberBetween(1, 20),
            'is_active' => fake()->boolean(85),
        ];
    }
}
