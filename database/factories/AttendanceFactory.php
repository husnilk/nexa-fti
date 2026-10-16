<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Period;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $absent = fake()->numberBetween(0, 2);
        $sick = fake()->numberBetween(0, 2);

        return [
            'period_id' => Period::factory(),
            'employee_id' => Employee::factory(),
            'year' => fake()->numberBetween(2025, 2027),
            'month' => fake()->numberBetween(1, 12),
            'present' => 22 - $absent - $sick,
            'absent' => $absent,
            'off_site_duty' => fake()->numberBetween(0, 3),
            'study_assignment' => 0,
            'sick_leave' => $sick,
            'personal_leave' => 0,
            'long_service_leave' => 0,
            'maternity_leave' => 0,
            'unpaid_leave' => 0,
            'annual_leave' => fake()->numberBetween(0, 2),
            'special_leave' => 0,
            'late_01' => fake()->numberBetween(0, 4),
            'late_02' => fake()->numberBetween(0, 2),
            'late_03' => fake()->numberBetween(0, 1),
            'late_04' => 0,
            'late_05' => 0,
            'late_06' => 0,
            'early_departure_01' => fake()->numberBetween(0, 2),
            'early_departure_02' => fake()->numberBetween(0, 1),
            'early_departure_03' => 0,
            'early_departure_04' => 0,
            'early_departure_05' => 0,
            'early_departure_06' => 0,
            'maternity_leave_01' => 0,
            'maternity_leave_02' => 0,
            'maternity_leave_03' => 0,
        ];
    }
}
