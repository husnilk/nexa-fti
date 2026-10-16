<?php

namespace Database\Factories;

use App\Models\Period;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Period>
 */
class PeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2024, 2027);
        $no = fake()->unique()->numberBetween(1, 1000);
        $start = Carbon::create($year, fake()->numberBetween(1, 10), 1);
        $end = $start->copy()->addMonths(2)->endOfMonth();

        return [
            'year' => $year,
            'no' => $no,
            'name' => "Period {$no} {$year}",
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'input_start_date' => $end->copy()->addDay()->toDateString(),
            'input_end_date' => $end->copy()->addDays(7)->toDateString(),
            'verification_start_date' => $end->copy()->addDays(8)->toDateString(),
            'verification_end_date' => $end->copy()->addDays(14)->toDateString(),
            'validation_start_date' => $end->copy()->addDays(15)->toDateString(),
            'validation_end_date' => $end->copy()->addDays(21)->toDateString(),
            'description' => fake()->sentence(),
            'status' => Period::STATUS_ACTIVE,
            'pir' => 3000,
            'bkd_semester' => fake()->randomElement(array_keys(config('remun.bkd_semesters'))),
            'p1_bkd_semester' => 'Ganjil',
            'p2_bkd_semester' => 'Genap',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Period::STATUS_INACTIVE,
        ]);
    }
}
