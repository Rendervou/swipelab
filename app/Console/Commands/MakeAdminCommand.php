<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminCommand extends Command
{
    protected $signature = 'make:admin {email : The email of the user to promote to admin}';
    protected $description = 'Promote a user to admin role';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        if ($user->isAdmin()) {
            $this->warn("User '{$user->name}' is already an admin.");
            return 0;
        }

        $user->update(['role' => 'admin']);
        $this->info("User '{$user->name}' has been promoted to admin! ✨");

        return 0;
    }
}
