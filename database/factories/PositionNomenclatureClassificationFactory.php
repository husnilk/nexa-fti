<?php

namespace Database\Factories;

use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureClassification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PositionNomenclatureClassification>
 */
class PositionNomenclatureClassificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'position_nomenclature_id' => PositionNomenclature::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
        ];
    }
}
