<?php

namespace Database\Factories;

use App\Models\AssetGrant;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'code' => fake()->unique()->bothify('AST-#####'),
            'type' => fake()->randomElement(['equipment', 'room']),
            'acquisition_type' => fake()->randomElement(['procurement', 'grant']),
            'acquisition_date' => fake()->date(),
            'acquisition_cost' => fake()->randomFloat(2, 0, 999999999999.99),
            'asset_grant_id' => AssetGrant::factory(),
            'condition' => fake()->randomElement(['good', 'minor_damage', 'major_damage']),
            'status' => fake()->randomElement(['available', 'in_use', 'maintenance', 'retired']),
        ];
    }
}
