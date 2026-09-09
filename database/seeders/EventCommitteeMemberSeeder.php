<?php

namespace Database\Seeders;

use App\Models\EventCommitteeMember;
use Illuminate\Database\Seeder;

class EventCommitteeMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventCommitteeMember::factory()->count(5)->create();
    }
}
