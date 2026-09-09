<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\Building;
use App\Models\Employee;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Room::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'id' => Asset::factory(),
            'building_id' => Building::factory(),
            'name' => fake()->word(),
            'code' => fake()->unique()->bothify('RM-###'),
            'floor' => fake()->numberBetween(1, 10).'F',
            'capacity' => fake()->numberBetween(10, 100),
            'is_public' => fake()->boolean(),
            'responsible_employee_id' => Employee::factory(),
        ];
    }
}
