<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeCertification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeCertification>
 */
class EmployeeCertificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = $this->faker->dateTimeBetween('-5 years', 'now');
        $expiryDate = $this->faker->optional(0.8)->dateTimeBetween($issueDate, '+5 years');

        return [
            'employee_id' => Employee::factory(),
            'name' => $this->faker->words(3, true),
            'institution' => $this->faker->company(),
            'certification_number' => $this->faker->bothify('CERT-#####-??'),
            'issue_date' => $issueDate->format('Y-m-d'),
            'expiry_date' => $expiryDate ? $expiryDate->format('Y-m-d') : null,
            'certificate_file' => null,
        ];
    }
}
