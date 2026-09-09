<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['Textbook', 'Reference Book', 'Monograph', 'Book Chapter']),
            'publisher' => $this->faker->company(),
            'publication_year' => $this->faker->year(),
            'isbn' => $this->faker->isbn13(),
            'description' => $this->faker->paragraph(),
        ];
    }
}
