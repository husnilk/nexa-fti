<?php

namespace Database\Factories;

use App\Models\EmploymentType;
use App\Models\Rubric;
use App\Models\RubricEmploymentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RubricEmploymentType>
 */
class RubricEmploymentTypeFactory extends Factory
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
            'employment_type_id' => EmploymentType::factory(),
        ];
    }
}
