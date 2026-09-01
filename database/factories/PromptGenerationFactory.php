<?php

namespace Database\Factories;

use App\Models\PromptGeneration;
use App\Models\PromptGenerator;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PromptGeneration>
 */
class PromptGenerationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'generator_id' => PromptGenerator::factory(),
            'inputs_payload' => [
                'topic' => fake()->words(2, true),
                'grade_level' => '5th',
                'objectives' => fake()->sentence(),
            ],
            'compiled_prompt' => fake()->paragraph(3),
        ];
    }

    /**
     * Indicate that the prompt generation is created by a guest (anonymous user).
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }
}
