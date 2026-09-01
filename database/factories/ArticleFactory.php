<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'category_id' => Category::factory(),
            'author_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(5),
            'image_url' => fake()->imageUrl(1200, 630),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'keywords' => fake()->words(4),
            'is_published' => true,
            'published_at' => now(),
        ];
    }

    /**
     * Indicate that the article is unpublished (draft).
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
