<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Training;
use Illuminate\Database\Seeder;

class TrainingSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::all();

        if ($employees->isEmpty()) {
            return;
        }

        Training::factory()->count(5)->create()->each(function (Training $training) use ($employees) {
            $randomEmployees = $employees->random(rand(1, min(3, $employees->count())));
            $training->employees()->attach($randomEmployees);
        });
    }
}
