<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeRank;
use App\Models\EmployeeRankHistory;
use Illuminate\Database\Seeder;

class EmployeeRankHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::all();
        $ranks = EmployeeRank::all();

        if ($employees->isEmpty() || $ranks->isEmpty()) {
            return;
        }

        foreach ($employees as $employee) {
            // Assign a random rank as current
            EmployeeRankHistory::factory()->create([
                'employee_id' => $employee->id,
                'employee_rank_id' => $ranks->random()->id,
                'start_date' => now()->subYears(2),
                'end_date' => null,
                'effective_date' => now()->subYears(2),
            ]);
        }
    }
}
