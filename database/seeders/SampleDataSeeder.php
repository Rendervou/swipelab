<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Design;
use App\Models\Category;
use App\Models\Feedback;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample users
        $users = [
            ['name' => 'Muhammad Al Fathi', 'email' => 'fathi@example.com', 'xp' => 2450],
            ['name' => 'Oemah Alfat', 'email' => 'oemah@example.com', 'xp' => 2380],
            ['name' => 'Creator Ndeso', 'email' => 'ndeso@example.com', 'xp' => 2210],
            ['name' => 'Jesika Bintang', 'email' => 'jesika@example.com', 'xp' => 2105],
            ['name' => 'Hari Wilbown', 'email' => 'hari@example.com', 'xp' => 1980],
            ['name' => 'Alex Rivera', 'email' => 'alex@example.com', 'xp' => 450],
            ['name' => 'Maria Chen', 'email' => 'maria@example.com', 'xp' => 380],
            ['name' => 'James Park', 'email' => 'james@example.com', 'xp' => 320],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                array_merge($user, [
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'email_verified_at' => now(),
                ])
            );
        }

        $categories = Category::all();
        $users = User::all();

        // Create sample designs
        $designs = [
            ['title' => 'Modern Dashboard UI', 'description' => 'A clean and modern dashboard interface', 'is_featured' => true],
            ['title' => 'E-commerce Platform', 'description' => 'Complete e-commerce website design', 'is_featured' => true],
            ['title' => 'Mobile App Interface', 'description' => 'Mobile app UI design', 'is_featured' => true],
            ['title' => 'Analytics Dashboard', 'description' => 'Data visualization dashboard', 'is_featured' => false],
            ['title' => 'Brand Identity Kit', 'description' => 'Complete brand identity system', 'is_featured' => false],
            ['title' => 'Social Media Template', 'description' => 'Social media post templates', 'is_featured' => false],
            ['title' => 'Website Redesign', 'description' => 'Modern website redesign concept', 'is_featured' => false],
            ['title' => 'Video UI Kit', 'description' => 'Video player UI components', 'is_featured' => false],
        ];

        foreach ($designs as $index => $design) {
            Design::create([
                'user_id' => $users[$index % count($users)]->id,
                'category_id' => $categories[rand(0, count($categories) - 1)]->id,
                'title' => $design['title'],
                'description' => $design['description'],
                'image_path' => 'placeholder.jpg',
                'is_featured' => $design['is_featured'],
                'status' => 'approved',
                'views' => rand(50, 1000),
                'likes' => rand(0, 500),
            ]);
        }

        // Create sample feedback
        $designs = Design::all();
        foreach ($designs as $design) {
            for ($i = 0; $i < rand(1, 5); $i++) {
                Feedback::create([
                    'design_id' => $design->id,
                    'user_id' => $users[rand(0, count($users) - 1)]->id,
                    'rating' => rand(3, 5),
                    'feedback' => 'Great design! Very well executed.',
                ]);
            }
        }
    }
}
