<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Badge;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed categories
        $categories = [
            ['name' => 'UI/UX Design', 'slug' => 'ui-ux', 'description' => 'User interface and experience design'],
            ['name' => 'Poster', 'slug' => 'poster', 'description' => 'Poster design'],
            ['name' => 'Logo', 'slug' => 'logo', 'description' => 'Logo design'],
            ['name' => 'Art', 'slug' => 'art', 'description' => 'Digital art and illustration'],
            ['name' => 'Web Design', 'slug' => 'web-design', 'description' => 'Website design'],
            ['name' => 'Motion Graphics', 'slug' => 'motion', 'description' => 'Animation and motion design'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Seed badges
        $badges = [
            ['name' => 'Getting Started', 'description' => 'Your first step', 'required_points' => 0],
            ['name' => 'Contributor', 'description' => 'Uploaded your first design', 'required_points' => 10],
            ['name' => 'Popular Creator', 'description' => 'Got 10 likes', 'required_points' => 50],
            ['name' => 'Master Creator', 'description' => 'Got 50 likes', 'required_points' => 100],
            ['name' => 'Community Star', 'description' => 'Reached 500 points', 'required_points' => 500],
            ['name' => 'Design Legend', 'description' => 'Reached 1000 points', 'required_points' => 1000],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(
                ['name' => $badge['name']],
                $badge
            );
        }
    }
}
