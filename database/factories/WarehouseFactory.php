<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'code' => 'WH-'.$this->faker->unique()->bothify('###'),
            'name' => $this->faker->randomElement([
                'Main Warehouse',
                'Tech Storage',
                'Administrative Depot',
                'Lab Supply Room',
                'Faculty Archive',
            ]),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
