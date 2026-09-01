<?php

namespace Database\Factories;

use App\Models\FormField;
use App\Models\GeneratorStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FormField>
 */
class FormFieldFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'step_id' => GeneratorStep::factory(),
            'name' => fake()->unique()->word(),
            'label' => fake()->sentence(3),
            'type' => 'text',
            'placeholder' => fake()->sentence(4),
            'help_text' => fake()->sentence(6),
            'options' => null,
            'validation_rules' => ['required', 'string', 'max:255'],
            'conditional_rules' => null,
            'field_order' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * State for select dropdown field with options.
     */
    public function select(array $options = ['option1' => 'Option 1', 'option2' => 'Option 2']): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'select',
            'options' => $options,
        ]);
    }

    /**
     * State for textarea field.
     */
    public function textarea(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'textarea',
        ]);
    }
}
