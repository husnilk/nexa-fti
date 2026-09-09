<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmployeeCertification;
use Illuminate\Database\Seeder;

class EmployeeCertificationSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();

        foreach ($employees as $employee) {
            EmployeeCertification::factory()->count(2)->create([
                'employee_id' => $employee->id,
            ]);
        }
    }
}
