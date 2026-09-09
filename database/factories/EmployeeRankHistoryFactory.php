<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeRank;
use App\Models\EmployeeRankHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeRankHistory>
 */
class EmployeeRankHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'employee_rank_id' => EmployeeRank::factory(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->optional()->date(),
            'effective_date' => $this->faker->date(),
            'decree_number' => $this->faker->bothify('###/SK/##/2026'),
            'decree_date' => $this->faker->date(),
            'decree_file' => null,
            'remarks' => $this->faker->sentence(),
        ];
    }
}
