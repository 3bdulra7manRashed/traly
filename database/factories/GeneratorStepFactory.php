<?php

namespace Database\Factories;

use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GeneratorStep>
 */
class GeneratorStepFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'generator_id' => PromptGenerator::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(8),
            'step_order' => fake()->numberBetween(1, 5),
        ];
    }
}
