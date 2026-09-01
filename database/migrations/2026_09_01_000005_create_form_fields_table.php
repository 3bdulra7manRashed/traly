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
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('step_id')->constrained('generator_steps')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('label', 255);
            $table->string('type', 50);
            $table->string('placeholder', 255)->nullable();
            $table->text('help_text')->nullable();
            $table->json('options')->nullable();
            $table->json('validation_rules')->nullable();
            $table->json('conditional_rules')->nullable();
            $table->integer('field_order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
