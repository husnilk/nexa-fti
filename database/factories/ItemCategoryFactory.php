<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $names = [
            'Stationery',
            'Office Electronics',
            'Furniture',
            'Lab Equipment',
            'Maintenance Tools',
            'Cleaning Supplies',
            'IT Infrastructure',
        ];

        return [
            'code' => 'CAT-'.$this->faker->unique()->bothify('####'),
            'name' => $this->faker->unique()->word().' '.$this->faker->randomElement($names),
            'description' => $this->faker->sentence(),
        ];
    }
}
