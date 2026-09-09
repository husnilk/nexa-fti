<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\EmploymentType;
use App\Models\FunctionalPosition;
use App\Models\Lecturer;
use App\Models\Position;
use App\Models\Role;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $empType = EmploymentType::first() ?? EmploymentType::factory()->create();
        $funcPos = FunctionalPosition::first() ?? FunctionalPosition::create(['name' => 'Lektor', 'code' => 'L', 'level' => 3]);
        $structPos = Position::first() ?? Position::create(['name' => 'Kepala Bagian', 'grade' => 10]);

        // Create a Lecturer
        $user1 = User::create([
            'name' => 'Dr. Ahmad Hidayat',
            'email' => 'ahmad@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        //        $user1->assignRole(Role::findOrCreate('user', 'web'));
        $user1->assignRole(Role::findOrCreate('super-admin', 'web'));

        $emp1 = Employee::create([
            'id' => $user1->id,
            'emp_number' => 'NIDN001',
            'id_card_number' => '3201234567890001',
            'tax_id_number' => '01.234.567.8-901.000',
            'name' => $user1->name,
            'birth_place' => 'Jakarta',
            'birth_date' => '1985-05-20',
            'gender' => 'male',
            'religion' => 'Islam',
            'marital_status' => 'Married',
            'address' => 'Jl. Merdeka No. 123, Jakarta Pusat',
            'phone' => '08123456789',
            'email' => $user1->email,
            'join_date' => '2015-01-01',
            'employment_type_id' => $empType->id,
            'status' => 1,
        ]);

        Lecturer::create([
            'id' => $emp1->id,
            'academic_rank' => 'Lektor Kepala',
            'functional_position_id' => $funcPos->id,
            'nuptk' => '1234567890',
            'expertise' => 'Artificial Intelligence',
        ]);

        // Create a Staff
        $user2 = User::create([
            'name' => 'Siti Aminah, S.Kom',
            'email' => 'siti@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $user2->assignRole(Role::findOrCreate('super-admin', 'web'));

        $emp2 = Employee::create([
            'id' => $user2->id,
            'emp_number' => 'NIP002',
            'id_card_number' => '3201234567890002',
            'name' => $user2->name,
            'birth_place' => 'Bandung',
            'birth_date' => '1990-10-15',
            'gender' => 'female',
            'religion' => 'Islam',
            'marital_status' => 'Single',
            'address' => 'Jl. Dago No. 45, Bandung',
            'phone' => '08129876543',
            'email' => $user2->email,
            'join_date' => '2018-03-01',
            'employment_type_id' => $empType->id,
            'supervisor_id' => $emp1->id,
            'status' => 1,
        ]);

        Staff::create([
            'id' => $emp2->id,
            'position_id' => $structPos->id,
            'skills' => 'Administration, Database Management',
        ]);
    }
}
