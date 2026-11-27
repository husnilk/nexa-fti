<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Rubric;
use App\Models\RubricOrganization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RubricOrganization>
 */
class RubricOrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rubric_id' => Rubric::factory(),
            'organization_id' => Organization::factory(),
        ];
    }
}
