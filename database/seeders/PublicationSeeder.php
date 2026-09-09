<?php

namespace Database\Seeders;

use App\Models\ConferenceProceeding;
use App\Models\JournalPublication;
use App\Models\Publication;
use App\Models\PublicationAuthor;
use App\Models\Research;
use App\Models\User;
use Illuminate\Database\Seeder;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $researches = Research::all();

        if ($users->isEmpty()) {
            return;
        }

        // Generate Journal Publications
        Publication::factory(15)->create()->each(function ($publication) use ($users, $researches) {
            if ($researches->isNotEmpty() && fake()->boolean(60)) {
                $publication->update(['research_id' => $researches->random()->id]);
            }

            JournalPublication::factory()->create([
                'id' => $publication->id,
            ]);

            $this->seedAuthors($publication, $users);
        });

        // Generate Conference Proceedings
        Publication::factory(10)->create()->each(function ($publication) use ($users, $researches) {
            if ($researches->isNotEmpty() && fake()->boolean(50)) {
                $publication->update(['research_id' => $researches->random()->id]);
            }

            ConferenceProceeding::factory()->create([
                'id' => $publication->id,
            ]);

            $this->seedAuthors($publication, $users);
        });
    }

    private function seedAuthors(Publication $publication, $users): void
    {
        $authorsCount = rand(1, 5);
        $authors = $users->random($authorsCount);

        foreach ($authors as $index => $user) {
            PublicationAuthor::factory()->create([
                'publication_id' => $publication->id,
                'author_id' => $user->id,
                'user_id' => $user->id,
                'author_order' => $index + 1,
                'is_corresponding' => $index === 0,
            ]);
        }
    }
}
