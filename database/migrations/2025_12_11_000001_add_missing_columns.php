<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add missing columns to designs table
        if (Schema::hasTable('designs')) {
            Schema::table('designs', function (Blueprint $table) {
                if (!Schema::hasColumn('designs', 'is_featured')) {
                    $table->boolean('is_featured')->default(false)->after('likes');
                }
                if (!Schema::hasColumn('designs', 'status')) {
                    $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('pending')->after('is_featured');
                }
            });
        }

        // Add missing columns to users table
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'xp')) {
                    $table->integer('xp')->default(0)->after('role');
                }
                if (!Schema::hasColumn('users', 'avatar_url')) {
                    $table->string('avatar_url')->nullable()->after('xp');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('designs')) {
            Schema::table('designs', function (Blueprint $table) {
                if (Schema::hasColumn('designs', 'is_featured')) {
                    $table->dropColumn('is_featured');
                }
                if (Schema::hasColumn('designs', 'status')) {
                    $table->dropColumn('status');
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'xp')) {
                    $table->dropColumn('xp');
                }
                if (Schema::hasColumn('users', 'avatar_url')) {
                    $table->dropColumn('avatar_url');
                }
            });
        }
    }
};
