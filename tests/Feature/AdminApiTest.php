<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin login and authentication flow.
     */
    public function test_admin_authentication_flow(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@traly.sa',
            'password' => Hash::make('password123'),
        ]);

        // Failed login
        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@traly.sa',
            'password' => 'wrong-password',
        ])->assertStatus(422);

        // Successful login
        $loginRes = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@traly.sa',
            'password' => 'password123',
        ])->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
            ])
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => ['id', 'name', 'email'],
                ],
            ]);

        $token = $loginRes->json('data.token');

        // Test GET /auth/me with Bearer token
        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@traly.sa');

        // Test logout
        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();
    }

    /**
     * Test protected admin endpoints reject unauthenticated access.
     */
    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/admin/stats')->assertUnauthorized();
        $this->getJson('/api/v1/admin/articles')->assertUnauthorized();
        $this->getJson('/api/v1/admin/generators')->assertUnauthorized();
    }

    /**
     * Test GET /api/v1/admin/stats.
     */
    public function test_admin_stats_endpoint(): void
    {
        $this->seed(DatabaseSeeder::class);
        $admin = User::first();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/stats');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    'total_articles',
                    'published_articles',
                    'total_generators',
                    'active_generators',
                    'total_generations',
                    'total_categories',
                    'recent_generations',
                ],
            ]);
    }

    /**
     * Test Admin Article CRUD operations and toggle-publish.
     */
    public function test_admin_article_crud_and_toggle_publish(): void
    {
        $this->seed(DatabaseSeeder::class);
        $admin = User::first();
        Sanctum::actingAs($admin);
        $category = Category::first();

        // 1. Create Article
        $storeRes = $this->postJson('/api/v1/admin/articles', [
            'title' => 'مقال جديد حول الذكاء الاصطناعي',
            'category_id' => $category->id,
            'excerpt' => 'نبذة عن المقال الجديد',
            'content' => 'محتوى تفصيلي غني بالأفكار التربوية الحديثة.',
            'keywords' => ['تربية', 'ذكاء اصطناعي'],
            'is_published' => true,
        ]);

        $storeRes->assertCreated()
            ->assertJsonPath('data.title', 'مقال جديد حول الذكاء الاصطناعي');

        $articleId = $storeRes->json('data.id');

        // 2. Read single article
        $this->getJson("/api/v1/admin/articles/{$articleId}")
            ->assertOk()
            ->assertJsonPath('data.id', $articleId);

        // 3. Update article
        $this->putJson("/api/v1/admin/articles/{$articleId}", [
            'title' => 'مقال محدث بالكامل',
            'content' => 'المحتوى الجديد المحدث',
        ])->assertOk()
            ->assertJsonPath('data.title', 'مقال محدث بالكامل');

        // 4. Toggle publish status
        $this->patchJson("/api/v1/admin/articles/{$articleId}/toggle-publish")
            ->assertOk()
            ->assertJsonPath('data.is_published', false);

        // 5. Delete article
        $this->deleteJson("/api/v1/admin/articles/{$articleId}")
            ->assertOk();

        $this->assertDatabaseMissing('articles', ['id' => $articleId]);
    }

    /**
     * Test Admin Generator CRUD with deep nested steps and form fields.
     */
    public function test_admin_generator_deep_nested_crud(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs($admin);

        // 1. Create Generator with 2 steps and 3 fields
        $payload = [
            'title' => 'أمر تصميم ورشة عمل تفاعلية',
            'icon' => 'sparkles',
            'short_description' => 'توليد خطة ورشة عمل تربوية',
            'prompt_template' => "أنت مدرب تربوي. خطط لورشة عمل حول {{workshop_topic}} لمدة {{duration}} ساعات.\n{{#if target_audience}}\nالفئة: {{target_audience}}\n{{/if}}",
            'is_active' => true,
            'order' => 1,
            'steps' => [
                [
                    'title' => 'معلومات الورشة',
                    'description' => 'بيانات الورشة العامة',
                    'step_order' => 1,
                    'fields' => [
                        [
                            'name' => 'workshop_topic',
                            'label' => 'موضوع الورشة',
                            'type' => 'text',
                            'placeholder' => 'مثال: مهارات التواصل الفعال',
                            'validation_rules' => ['required', 'string'],
                            'field_order' => 1,
                        ],
                        [
                            'name' => 'duration',
                            'label' => 'مدة الورشة بالساعات',
                            'type' => 'number',
                            'validation_rules' => ['required', 'numeric'],
                            'field_order' => 2,
                        ],
                    ],
                ],
                [
                    'title' => 'الجمهور والأهداف',
                    'description' => 'تحديد الفئة المستهدفة',
                    'step_order' => 2,
                    'fields' => [
                        [
                            'name' => 'target_audience',
                            'label' => 'الفئة المستهدفة',
                            'type' => 'text',
                            'validation_rules' => ['nullable', 'string'],
                            'field_order' => 1,
                        ],
                    ],
                ],
            ],
        ];

        $storeRes = $this->postJson('/api/v1/admin/generators', $payload);

        $storeRes->assertCreated()
            ->assertJsonPath('data.title', 'أمر تصميم ورشة عمل تفاعلية')
            ->assertJsonCount(2, 'data.steps')
            ->assertJsonCount(2, 'data.steps.0.fields')
            ->assertJsonCount(1, 'data.steps.1.fields');

        $generatorId = $storeRes->json('data.id');

        // 2. Read single generator
        $this->getJson("/api/v1/admin/generators/{$generatorId}")
            ->assertOk()
            ->assertJsonPath('data.id', $generatorId);

        // 3. Update Generator with modified title and steps
        $updatePayload = [
            'title' => 'أمر تصميم ورشة عمل تفاعلية - معدل',
            'steps' => [
                [
                    'title' => 'الخطوة المحدثة الوحيدة',
                    'step_order' => 1,
                    'fields' => [
                        [
                            'name' => 'single_field',
                            'label' => 'حقل واحد فقط',
                            'type' => 'text',
                            'validation_rules' => ['required'],
                            'field_order' => 1,
                        ],
                    ],
                ],
            ],
        ];

        $this->putJson("/api/v1/admin/generators/{$generatorId}", $updatePayload)
            ->assertOk()
            ->assertJsonPath('data.title', 'أمر تصميم ورشة عمل تفاعلية - معدل')
            ->assertJsonCount(1, 'data.steps')
            ->assertJsonCount(1, 'data.steps.0.fields');

        // 4. Toggle active status
        $this->patchJson("/api/v1/admin/generators/{$generatorId}/toggle-active")
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        // 5. Delete Generator
        $this->deleteJson("/api/v1/admin/generators/{$generatorId}")
            ->assertOk();

        $this->assertDatabaseMissing('prompt_generators', ['id' => $generatorId]);
    }
}
