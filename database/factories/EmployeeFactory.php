<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmploymentType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();
        $user->assignRole(Role::findOrCreate('super-admin'));

        return [
            'id' => $user->id,
            'emp_number' => fake()->unique()->numerify('##########'),
            'id_card_number' => fake()->unique()->numerify('################'),
            'tax_id_number' => fake()->numerify('###############'),
            'name' => fake()->name(),
            'birth_place' => fake()->city(),
            'birth_date' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female']),
            'religion' => fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']),
            'marital_status' => fake()->randomElement(['Single', 'Married', 'Divorced', 'Widowed']),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => $user->email,
            'join_date' => fake()->date(),
            'employment_type_id' => EmploymentType::factory(),
            'supervisor_id' => null,
            'status' => 1,
        ];
    }
}
