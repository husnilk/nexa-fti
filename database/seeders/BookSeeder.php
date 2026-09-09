<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::findOrCreate('book.view', 'web');
        Permission::findOrCreate('book.manage', 'web');

        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        Book::factory(10)->create()->each(function (Book $book) use ($users) {
            $authors = $users->random(rand(1, min(3, $users->count())));
            $book->authors()->attach($authors);
        });
    }
}
