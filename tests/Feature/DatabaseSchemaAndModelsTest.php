<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGeneration;
use App\Models\PromptGenerator;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSchemaAndModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_and_article_models_and_relations(): void
    {
        $category = Category::factory()->create([
            'name' => 'Artificial Intelligence',
            'slug' => 'artificial-intelligence',
            'description' => 'AI related articles',
        ]);

        $author = User::factory()->create();

        $article = Article::factory()->create([
            'category_id' => $category->id,
            'author_id' => $author->id,
            'title' => 'Prompt Engineering 101',
            'slug' => 'prompt-engineering-101',
            'keywords' => ['ai', 'prompts', 'education'],
            'is_published' => true,
            'published_at' => now(),
        ]);

        // Category relations
        $this->assertCount(1, $category->articles);
        $this->assertTrue($category->articles->first()->is($article));

        // Article relations
        $this->assertTrue($article->category->is($category));
        $this->assertTrue($article->author->is($author));

        // User relations
        $this->assertCount(1, $author->articles);
        $this->assertTrue($author->articles->first()->is($article));

        // Casts
        $this->assertIsArray($article->keywords);
        $this->assertEquals(['ai', 'prompts', 'education'], $article->keywords);
        $this->assertTrue($article->is_published);
        $this->assertInstanceOf(Carbon::class, $article->published_at);
    }

    public function test_category_cascade_deletes_articles(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();
        $article = Article::factory()->create([
            'category_id' => $category->id,
            'author_id' => $author->id,
        ]);

        $category->delete();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
        $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    }

    public function test_author_cascade_deletes_articles(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();
        $article = Article::factory()->create([
            'category_id' => $category->id,
            'author_id' => $author->id,
        ]);

        $author->delete();

        $this->assertDatabaseMissing('users', ['id' => $author->id]);
        $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    }

    public function test_prompt_generator_structure_relations_and_casts(): void
    {
        $generator = PromptGenerator::factory()->create([
            'title' => 'Lesson Plan Generator',
            'slug' => 'lesson-plan-generator',
            'is_active' => true,
            'order' => 1,
            'prompt_template' => 'Create a lesson plan on {{topic}}',
        ]);

        $step1 = GeneratorStep::factory()->create([
            'generator_id' => $generator->id,
            'title' => 'Basic Info',
            'step_order' => 1,
        ]);

        $step2 = GeneratorStep::factory()->create([
            'generator_id' => $generator->id,
            'title' => 'Advanced Info',
            'step_order' => 2,
        ]);

        $field1 = FormField::factory()->create([
            'step_id' => $step1->id,
            'name' => 'topic',
            'label' => 'Lesson Topic',
            'type' => 'text',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => ['visible_if' => 'always'],
            'field_order' => 1,
        ]);

        $field2 = FormField::factory()->create([
            'step_id' => $step1->id,
            'name' => 'grade_level',
            'label' => 'Grade Level',
            'type' => 'select',
            'options' => ['elementary' => 'Elementary', 'high_school' => 'High School'],
            'validation_rules' => ['required'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        $field3 = FormField::factory()->create([
            'step_id' => $step2->id,
            'name' => 'notes',
            'label' => 'Additional Notes',
            'type' => 'textarea',
            'options' => null,
            'validation_rules' => ['nullable', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        $user = User::factory()->create();

        $generation = PromptGeneration::factory()->create([
            'user_id' => $user->id,
            'generator_id' => $generator->id,
            'inputs_payload' => [
                'topic' => 'Photosynthesis',
                'grade_level' => 'elementary',
                'notes' => 'Include diagrams',
            ],
            'compiled_prompt' => 'Create a lesson plan on Photosynthesis for elementary students. Include diagrams.',
        ]);

        // PromptGenerator relations
        $this->assertCount(2, $generator->steps);
        $this->assertCount(2, $generator->generatorSteps);
        $this->assertTrue($generator->steps->first()->is($step1));

        // HasManyThrough FormFields
        $this->assertCount(3, $generator->formFields);

        // PromptGenerations relation
        $this->assertCount(1, $generator->promptGenerations);
        $this->assertCount(1, $generator->generations);
        $this->assertTrue($generator->promptGenerations->first()->is($generation));

        // GeneratorStep relations
        $this->assertTrue($step1->promptGenerator->is($generator));
        $this->assertTrue($step1->generator->is($generator));
        $this->assertCount(2, $step1->formFields);
        $this->assertCount(2, $step1->fields);
        $this->assertTrue($step1->formFields->first()->is($field1));

        // FormField relations
        $this->assertTrue($field1->generatorStep->is($step1));
        $this->assertTrue($field1->step->is($step1));

        // PromptGeneration relations
        $this->assertTrue($generation->promptGenerator->is($generator));
        $this->assertTrue($generation->generator->is($generator));
        $this->assertTrue($generation->user->is($user));

        // User relations
        $this->assertCount(1, $user->promptGenerations);
        $this->assertTrue($user->promptGenerations->first()->is($generation));

        // Casts verification
        $this->assertIsBool($generator->is_active);
        $this->assertTrue($generator->is_active);
        $this->assertIsInt($generator->order);
        $this->assertEquals(1, $generator->order);

        $this->assertIsInt($step1->step_order);
        $this->assertEquals(1, $step1->step_order);

        $this->assertIsArray($field1->validation_rules);
        $this->assertEquals(['required', 'string'], $field1->validation_rules);
        $this->assertIsArray($field1->conditional_rules);
        $this->assertEquals(['visible_if' => 'always'], $field1->conditional_rules);
        $this->assertIsInt($field1->field_order);
        $this->assertEquals(1, $field1->field_order);

        $this->assertIsArray($field2->options);
        $this->assertEquals(['elementary' => 'Elementary', 'high_school' => 'High School'], $field2->options);

        $this->assertIsArray($generation->inputs_payload);
        $this->assertEquals('Photosynthesis', $generation->inputs_payload['topic']);
    }

    public function test_generator_cascade_deletes_steps_fields_and_generations(): void
    {
        $generator = PromptGenerator::factory()->create();
        $step = GeneratorStep::factory()->create(['generator_id' => $generator->id]);
        $field = FormField::factory()->create(['step_id' => $step->id]);
        $generation = PromptGeneration::factory()->create(['generator_id' => $generator->id]);

        $generator->delete();

        $this->assertDatabaseMissing('prompt_generators', ['id' => $generator->id]);
        $this->assertDatabaseMissing('generator_steps', ['id' => $step->id]);
        $this->assertDatabaseMissing('form_fields', ['id' => $field->id]);
        $this->assertDatabaseMissing('prompt_generations', ['id' => $generation->id]);
    }

    public function test_user_deletion_sets_prompt_generation_user_id_to_null(): void
    {
        $user = User::factory()->create();
        $generator = PromptGenerator::factory()->create();
        $generation = PromptGeneration::factory()->create([
            'user_id' => $user->id,
            'generator_id' => $generator->id,
        ]);

        $user->delete();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseHas('prompt_generations', [
            'id' => $generation->id,
            'user_id' => null,
        ]);
    }
}
