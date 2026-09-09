<?php

namespace Database\Seeders;

use App\Models\CommunityService;
use App\Models\CommunityServiceMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunityServiceSeeder extends Seeder
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

        CommunityService::factory(10)->create()->each(function ($service) use ($users) {
            // Assign 1 to 5 members
            $members = $users->random(rand(1, 5));

            $roles = ['Project Lead', 'Volunteer', 'Coordinator', 'Field Worker'];

            foreach ($members as $index => $user) {
                CommunityServiceMember::factory()->create([
                    'community_service_id' => $service->id,
                    'user_id' => $user->id,
                    'role' => $index === 0 ? 'Project Lead' : fake()->randomElement($roles),
                ]);
            }
        });
    }
}
