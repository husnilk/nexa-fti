<?php

namespace Database\Factories;

use App\Models\Lecturer;
use App\Models\Organization;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'reg_no' => fake()->unique()->numerify('STUD-####'),
            'reg_date' => fake()->date(),
            'birth_place' => fake()->city(),
            'birth_date' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female']),
            'religion' => fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']),
            'email' => $user->email,
            'campus_email' => fake()->unique()->safeEmail(),
            'phone_no' => fake()->phoneNumber(),
            'home_address' => fake()->address(),
            'home_town' => fake()->city(),
            'home_province' => fake()->state(),
            'home_postalcode' => fake()->postcode(),
            'current_address' => fake()->address(),
            'current_town' => fake()->city(),
            'current_province' => fake()->state(),
            'current_postalcode' => fake()->postcode(),
            'department_id' => Organization::factory(),
            'year' => fake()->year(),
            'status' => fake()->randomElement(['active', 'inactive', 'graduated', 'withdrawn', 'on_leave']),
            'advisor_id' => Lecturer::factory(),
        ];
    }
}
