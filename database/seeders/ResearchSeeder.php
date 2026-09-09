<?php

namespace Database\Seeders;

use App\Models\Research;
use App\Models\ResearchMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResearchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        Research::factory(10)->create()->each(function ($research) use ($users) {
            // Assign 1 to 4 members to each research project
            $members = $users->random(rand(1, 4));

            $roles = ['Lead Researcher', 'Co-Researcher', 'Assistant Researcher', 'Data Analyst'];

            foreach ($members as $index => $user) {
                ResearchMember::factory()->create([
                    'research_id' => $research->id,
                    'user_id' => $user->id,
                    'role' => $index === 0 ? 'Lead Researcher' : fake()->randomElement($roles),
                ]);
            }
        });
    }
}
