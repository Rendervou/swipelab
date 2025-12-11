<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Design;
use App\Models\Category;
use App\Models\Feedback;
use App\Models\Badge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@swipelab.com'],
            [
                'name' => 'Admin SwipeLab',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'xp' => 5000,
                'email_verified_at' => now(),
            ]
        );

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

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, [
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'email_verified_at' => now(),
                ])
            );
        }

        $allUsers = User::all();
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->error('Please run DatabaseSeeder first to create categories!');
            return;
        }

        // Create sample designs
        $designs = [
            ['title' => 'Modern Dashboard UI', 'description' => 'A clean and modern dashboard interface with analytics', 'is_featured' => true],
            ['title' => 'E-commerce Platform', 'description' => 'Complete e-commerce website design with checkout flow', 'is_featured' => true],
            ['title' => 'Mobile App Interface', 'description' => 'Mobile app UI design with smooth animations', 'is_featured' => true],
            ['title' => 'Analytics Dashboard', 'description' => 'Data visualization dashboard with charts', 'is_featured' => false],
            ['title' => 'Brand Identity Kit', 'description' => 'Complete brand identity system with guidelines', 'is_featured' => false],
            ['title' => 'Social Media Template', 'description' => 'Social media post templates for Instagram', 'is_featured' => false],
            ['title' => 'Website Redesign', 'description' => 'Modern website redesign concept', 'is_featured' => false],
            ['title' => 'Video UI Kit', 'description' => 'Video player UI components library', 'is_featured' => false],
            ['title' => 'Food Delivery App', 'description' => 'Mobile app for food ordering', 'is_featured' => true],
            ['title' => 'Fitness Tracker', 'description' => 'Fitness and health tracking app', 'is_featured' => false],
        ];

        foreach ($designs as $index => $designData) {
            $design = Design::create([
                'user_id' => $allUsers[$index % count($allUsers)]->id,
                'category_id' => $categories[rand(0, count($categories) - 1)]->id,
                'title' => $designData['title'],
                'description' => $designData['description'],
                'image_path' => 'placeholder.jpg',
                'is_featured' => $designData['is_featured'],
                'status' => 'approved',
                'views' => rand(50, 1000),
                'likes' => rand(0, 500),
            ]);

            // Add 2-5 feedbacks per design
            for ($i = 0; $i < rand(2, 5); $i++) {
                $randomUser = $allUsers[rand(0, count($allUsers) - 1)];
                
                // Check if feedback already exists
                $exists = Feedback::where('design_id', $design->id)
                    ->where('user_id', $randomUser->id)
                    ->exists();
                
                if (!$exists) {
                    Feedback::create([
                        'design_id' => $design->id,
                        'user_id' => $randomUser->id,
                        'rating' => rand(3, 5),
                        'comment' => 'Great design! Very well executed and professional.',
                    ]);
                }
            }
        }

        $this->command->info('Sample data seeded successfully!');
    }
}