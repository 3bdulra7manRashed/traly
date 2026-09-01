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
        Schema::create('generator_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generator_id')->constrained('prompt_generators')->cascadeOnDelete();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->integer('step_order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generator_steps');
    }
};
