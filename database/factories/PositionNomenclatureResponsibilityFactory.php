<?php

namespace Database\Factories;

use App\Models\PositionNomenclature;
use App\Models\PositionNomenclatureResponsibility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PositionNomenclatureResponsibility>
 */
class PositionNomenclatureResponsibilityFactory extends Factory
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
            'name' => fake()->sentence(),
        ];
    }
}
