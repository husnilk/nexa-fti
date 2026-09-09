<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\OrganizationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'code' => fake()->unique()->bothify('ORG-####'),
            'organization_type_id' => OrganizationType::factory(),
            'parent_id' => null,
            'is_active' => fake()->boolean(90),
            'description' => fake()->sentence(),
        ];
    }

    /**
     * Indicate that the organization is a branch of another.
     */
    public function childOf(Organization $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
        ]);
    }
}
