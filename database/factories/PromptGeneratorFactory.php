<?php

namespace Database\Factories;

use App\Models\PromptGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PromptGenerator>
 */
class PromptGeneratorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(5),
            'icon' => 'sparkles',
            'short_description' => fake()->sentence(10),
            'prompt_template' => "You are an expert educator. Create a lesson on {{topic}} for {{grade_level}} grade students.\nKey Objectives: {{objectives}}",
            'is_active' => true,
            'order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the prompt generator is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
