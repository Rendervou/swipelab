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
        Schema::create('feedback_annotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained('designs')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('comment');
            $table->json('coordinates'); // {x, y, width, height}
            $table->string('annotation_type')->default('comment'); // comment, highlight, question
            $table->timestamps();
            $table->index('design_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_annotations');
    }
};