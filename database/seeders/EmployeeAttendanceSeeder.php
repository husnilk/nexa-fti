<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeAttendance;
use Illuminate\Database\Seeder;

class EmployeeAttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::all();

        if ($employees->isEmpty()) {
            return;
        }

        foreach ($employees as $employee) {
            // Seed for the last 30 days
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays($i);

                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                $status = fake()->randomElement(['present', 'present', 'present', 'absent', 'leave']);

                if ($status === 'present') {
                    EmployeeAttendance::factory()->create([
                        'employee_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'check_in' => $date->copy()->setTime(8, rand(0, 30), rand(0, 59)),
                        'check_out' => $date->copy()->setTime(17, rand(0, 30), rand(0, 59)),
                        'status' => 'present',
                    ]);
                } else {
                    EmployeeAttendance::create([
                        'employee_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'status' => $status,
                        'notes' => fake()->sentence(),
                    ]);
                }
            }
        }
    }
}
