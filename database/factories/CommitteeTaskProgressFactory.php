<?php

namespace Database\Factories;

use App\Models\CommitteeTask;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeTaskProgressFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'committee_task_id' => CommitteeTask::factory(),
            'progress_date' => fake()->dateTime(),
            'progress_percentage' => fake()->randomFloat(2, 0, 999.99),
            'description' => fake()->text(),
            'attachment' => fake()->word(),
            'created_by' => Employee::factory(),
            'created_by_id' => Employee::factory(),
        ];
    }
}
