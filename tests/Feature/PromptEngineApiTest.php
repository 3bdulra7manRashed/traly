<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\PromptGenerator;
use App\Models\User;
use App\Services\PromptCompilerService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromptEngineApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test PromptCompilerService logic comprehensively.
     */
    public function test_prompt_compiler_service_features(): void
    {
        $compiler = new PromptCompilerService;

        $template = <<<'TEMPLATE'
مرحباً بالمعلم: {{teacher_name}}
المادة: {{subject}}

{{#if topics}}
المواضيع المقررة:
{{topics}}
{{/if}}

{{#if notes}}
ملاحظات إضافية:
{{notes}}
{{/if}}

{{#if empty_field}}
هذا الحقل لن يظهر أبداً: {{empty_field}}
{{/if}}

الخاتمة: {{footer_text}}
TEMPLATE;

        $data = [
            'teacher_name' => 'أحمد العلي',
            'subject' => 'العلوم',
            'topics' => ['الخلية الحية', 'الأنسجة النباتية', 'التنفس الخلوي'],
            'notes' => 'التركيز على التطبيقات المعملية',
            'empty_field' => '', // Should be removed
            // footer_text is missing, should be cleaned up
        ];

        $result = $compiler->compile($template, $data);

        // Verify direct variables
        $this->assertStringContainsString('مرحباً بالمعلم: أحمد العلي', $result);
        $this->assertStringContainsString('المادة: العلوم', $result);

        // Verify array joining with Arabic comma
        $this->assertStringContainsString('الخلية الحية، الأنسجة النباتية، التنفس الخلوي', $result);

        // Verify present conditional block
        $this->assertStringContainsString('ملاحظات إضافية:', $result);
        $this->assertStringContainsString('التركيز على التطبيقات المعملية', $result);

        // Verify missing/empty conditional block is removed
        $this->assertStringNotContainsString('هذا الحقل لن يظهر أبداً', $result);

        // Verify unpopulated tags are stripped
        $this->assertStringNotContainsString('{{footer_text}}', $result);
        $this->assertStringContainsString('الخاتمة:', $result);
    }

    /**
     * Test GET /api/v1/generators list.
     */
    public function test_can_list_active_generators(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Create an inactive generator to ensure filtering works
        PromptGenerator::factory()->inactive()->create([
            'slug' => 'inactive-generator',
        ]);

        $response = $this->getJson('/api/v1/generators');

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(4, 'data')
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'slug', 'icon', 'short_description', 'is_active', 'order', 'created_at'],
                ],
            ]);

        // Verify inactive generator is excluded
        $slugs = collect($response->json('data'))->pluck('slug');
        $this->assertFalse($slugs->contains('inactive-generator'));
        $this->assertTrue($slugs->contains('educational-content'));
    }

    /**
     * Test GET /api/v1/generators/{slug} details.
     */
    public function test_can_get_single_generator_with_steps_and_fields(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->getJson('/api/v1/generators/educational-content');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'educational-content',
                    'title' => 'أمر بناء محتوى تعليمي',
                ],
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'icon',
                    'short_description',
                    'is_active',
                    'order',
                    'steps' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'step_order',
                            'fields' => [
                                '*' => [
                                    'id',
                                    'name',
                                    'label',
                                    'type',
                                    'placeholder',
                                    'help_text',
                                    'options',
                                    'validation_rules',
                                    'conditional_rules',
                                    'field_order',
                                ],
                            ],
                        ],
                    ],
                ],
            ]);

        // Check 404 for non-existent generator
        $this->getJson('/api/v1/generators/non-existent-slug')
            ->assertNotFound();
    }

    /**
     * Test POST /api/v1/generators/{slug}/generate validation failure.
     */
    public function test_generate_prompt_validates_required_fields(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Send empty inputs for educational-content
        $response = $this->postJson('/api/v1/generators/educational-content/generate', [
            'inputs' => [
                // topic_title is missing
                // content_type is missing
            ],
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'بيانات الإدخال غير صالحة',
            ])
            ->assertJsonValidationErrors(['inputs.content_type', 'inputs.topic_title']);
    }

    /**
     * Test POST /api/v1/generators/{slug}/generate successfully creates prompt.
     */
    public function test_can_generate_prompt_and_store_generation_record(): void
    {
        $this->seed(DatabaseSeeder::class);

        $payload = [
            'inputs' => [
                'content_type' => 'خطة درس تعليمي',
                'topic_title' => 'دورة الماء في الطبيعة',
                'target_audience' => 'الصف الرابع الابتدائي',
                'delivery_method' => 'حضوري في الفصل',
                'main_goal' => 'فهم مراحل دورة الماء وتأثيرها البيئي',
                'elements_to_include' => ['أمثلة من واقع الحياة', 'أسئلة حوارية وتفكير ناقد'],
                'cautions' => 'تجنب استخدام المعادلات الكيميائية المعقدة',
            ],
        ];

        $response = $this->postJson('/api/v1/generators/educational-content/generate', $payload);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'تم توليد الأمر بنجاح',
                'data' => [
                    'generator_slug' => 'educational-content',
                ],
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'generator_slug',
                    'compiled_prompt',
                    'inputs',
                    'created_at',
                ],
            ]);

        $compiledPrompt = $response->json('data.compiled_prompt');
        $this->assertStringContainsString('دورة الماء في الطبيعة', $compiledPrompt);
        $this->assertStringContainsString('الصف الرابع الابتدائي', $compiledPrompt);
        $this->assertStringContainsString('أمثلة من واقع الحياة، أسئلة حوارية وتفكير ناقد', $compiledPrompt);
        $this->assertStringContainsString('تجنب استخدام المعادلات الكيميائية المعقدة', $compiledPrompt);

        // Verify database record
        $this->assertDatabaseHas('prompt_generations', [
            'id' => $response->json('data.id'),
            'user_id' => null,
        ]);
    }

    /**
     * Test POST /api/v1/generators/{slug}/generate with authenticated user.
     */
    public function test_can_generate_prompt_with_authenticated_user(): void
    {
        $this->seed(DatabaseSeeder::class);
        $user = User::factory()->create();

        $payload = [
            'inputs' => [
                'initiative_name' => 'رواد القراءة والمستقبل',
                'initiative_type' => 'بناء قيمي وأخلاقي',
                'target_age_group' => '13-16 سنة',
                'core_need' => 'انخفاض معدلات القراءة الحرة لدى الناشئة',
                'expected_outcomes' => 'قراءة 10 كتب لكل مشارك خلال العام',
                'available_budget' => 'متوسطة (5,000 - 20,000 ريال)',
                'risk_factors' => 'تشتت الانتباه بسبب وسائل التواصل',
            ],
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/generators/educational-initiative/generate', $payload);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('prompt_generations', [
            'id' => $response->json('data.id'),
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test GET /api/v1/articles with filters and search.
     */
    public function test_can_list_and_filter_articles(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Test basic listing
        $response = $this->getJson('/api/v1/articles');
        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'slug', 'image_url', 'excerpt', 'content', 'keywords', 'category', 'author', 'published_at'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);

        // Filter by category
        $catResponse = $this->getJson('/api/v1/articles?category=education-and-ai');
        $catResponse->assertOk()
            ->assertJsonPath('data.0.slug', 'effective-prompt-engineering-in-education');

        // Filter by search
        $searchResponse = $this->getJson('/api/v1/articles?search=القيم');
        $searchResponse->assertOk();
        $this->assertGreaterThan(0, count($searchResponse->json('data')));
    }

    /**
     * Test GET /api/v1/articles/{slug} detail with related articles.
     */
    public function test_can_get_single_article_with_related(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->getJson('/api/v1/articles/effective-prompt-engineering-in-education');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'effective-prompt-engineering-in-education',
                ],
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'image_url',
                    'excerpt',
                    'content',
                    'keywords',
                    'category' => ['id', 'name', 'slug'],
                    'author' => ['id', 'name'],
                    'related_articles',
                    'published_at',
                ],
            ]);
    }

    /**
     * Test GET /api/v1/categories with article counts.
     */
    public function test_can_list_categories_with_article_counts(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->getJson('/api/v1/categories');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'articles_count', 'created_at'],
                ],
            ]);

        $categories = $response->json('data');
        $this->assertCount(4, $categories);
        $this->assertGreaterThanOrEqual(1, $categories[0]['articles_count']);
    }
}
