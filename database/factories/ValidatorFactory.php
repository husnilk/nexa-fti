<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Organization;
use App\Models\Period;
use App\Models\Validator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Validator>
 */
class ValidatorFactory extends Factory
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
            'period_id' => Period::factory(),
            'employee_id' => Employee::factory(),
            'position' => Validator::POSITION_MEMBER,
            'is_active' => true,
        ];
    }
}
