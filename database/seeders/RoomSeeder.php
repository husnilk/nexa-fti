<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Employee;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure we have buildings
        $buildings = Building::all();
        if ($buildings->isEmpty()) {
            $buildings = Building::factory()->count(3)->create([
                'name' => fn () => fake()->unique()->randomElement([
                    'Gedung A (Rektorat)',
                    'Gedung B (Dekanat FTI)',
                    'Gedung C (Lab Terpadu)',
                ]) ?? fake()->name(),
                'code' => fn () => fake()->unique()->randomElement([
                    'GD-A',
                    'GD-B',
                    'GD-C',
                ]) ?? fake()->unique()->bothify('GD-###'),
            ]);
        }

        // 2. Ensure we have employees
        $employees = Employee::all();
        if ($employees->isEmpty()) {
            $employees = Employee::factory()->count(5)->create();
        }

        // 3. Seed some rooms
        $roomNames = [
            'Ruang Seminar 1',
            'Ruang Sidang Utama',
            'Laboratorium Rekayasa Perangkat Lunak',
            'Laboratorium Jaringan Komputer',
            'Ruang Kelas 101',
            'Ruang Kelas 102',
            'Auditorium FTI',
            'Ruang Rapat Senat',
        ];

        foreach ($roomNames as $index => $roomName) {
            $building = $buildings->random();
            $employee = $employees->random();

            Room::factory()->create([
                'building_id' => $building->id,
                'responsible_employee_id' => $employee->id,
                'name' => $roomName,
                'code' => sprintf('R-%03d', $index + 1),
                'floor' => rand(1, 4).'F',
                'capacity' => fake()->randomElement([20, 30, 40, 50, 100]),
                'is_public' => fake()->boolean(80), // 80% chance of being public
            ]);
        }
    }
}
