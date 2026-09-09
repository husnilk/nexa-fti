<?php

namespace Database\Factories;

use App\Models\EmployeeType;
use App\Models\EmploymentContract;
use App\Models\EmploymentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmploymentType>
 */
class EmploymentTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_type_id' => EmployeeType::factory(),
            'employment_contract_id' => EmploymentContract::factory(),
            'remun_status' => fake()->randomElement(['Status A', 'Status B', 'Status C']),
        ];
    }
}
