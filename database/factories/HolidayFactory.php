<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HolidayFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'date' => fake()->unique()->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'name' => fake()->randomElement([
                'New Year\'s Day',
                'Lunar New Year',
                'Good Friday',
                'Eid al-Fitr',
                'Eid al-Adha',
                'Independence Day',
                'Christmas Day',
                'Labor Day',
                'Ascension Day',
                'Prophet Muhammad\'s Birthday',
                'National Education Day',
            ]),
        ];
    }
}
