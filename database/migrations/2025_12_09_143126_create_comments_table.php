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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained('designs')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('annotation_id')->nullable()->constrained('feedback_annotations')->cascadeOnDelete();
            $table->text('content');
            $table->integer('likes')->default(0);
            $table->timestamps();
            $table->index('design_id');
            $table->index('user_id');
            $table->index('annotation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};