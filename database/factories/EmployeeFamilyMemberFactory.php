<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeFamilyMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeFamilyMember>
 */
class EmployeeFamilyMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'name' => fake()->name(),
            'relationship' => fake()->randomElement(['spouse', 'child', 'parent', 'sibling', 'other']),
            'gender' => fake()->randomElement(['male', 'female']),
            'birth_place' => fake()->city(),
            'birth_date' => fake()->date(),
            'id_card_number' => fake()->numerify('################'),
            'occupation' => fake()->jobTitle(),
            'phone' => fake()->phoneNumber(),
            'is_dependent' => fake()->boolean(),
            'notes' => fake()->sentence(),
        ];
    }
}
