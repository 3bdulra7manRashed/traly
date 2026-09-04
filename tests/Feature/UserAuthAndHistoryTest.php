<?php

namespace Tests\Feature;

use App\Models\PromptGeneration;
use App\Models\PromptGenerator;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAuthAndHistoryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful user registration.
     */
    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'أحمد المربي',
            'email' => 'educator@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح',
            ])
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => ['id', 'name', 'email', 'role'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'educator@example.com',
            'role' => 'user',
        ]);
    }

    /**
     * Test registration validation errors.
     */
    public function test_user_registration_validation(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        // Test duplicated email and short password
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => '',
            'email' => 'taken@example.com',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Test user login.
     */
    public function test_user_can_login_and_receive_role(): void
    {
        $user = User::factory()->create([
            'email' => 'teacher@example.com',
            'password' => 'secret1234',
            'role' => 'user',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'teacher@example.com',
            'password' => 'secret1234',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'email' => 'teacher@example.com',
                        'role' => 'user',
                    ],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    /**
     * Test user login with invalid credentials.
     */
    public function test_user_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'test@example.com', 'password' => 'correct-pass']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-pass',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test fetching and updating user profile.
     */
    public function test_user_profile_fetch_and_update(): void
    {
        $user = User::factory()->create(['name' => 'Original Name', 'role' => 'user']);

        // Fetch profile
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/user/profile');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => 'Original Name',
                    'role' => 'user',
                ],
            ]);

        // Update profile
        $updateResponse = $this->actingAs($user, 'sanctum')->putJson('/api/v1/user/profile', [
            'name' => 'Updated Name',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated Name',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
        ]);
    }

    /**
     * Test prompt generation records user_id when authenticated.
     */
    public function test_prompt_generation_stores_user_id_when_authenticated(): void
    {
        $this->seed(DatabaseSeeder::class);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/generators/educational-content/generate', [
            'inputs' => [
                'content_type' => 'درس تعليمي تفاعلي',
                'topic_title' => 'الاحتباس الحراري والتغير المناخي',
                'target_audience' => 'المرحلة الثانوية (15-17 سنة)',
                'delivery_method' => 'نقاش صفي تفاعلي وعرض تقديمي',
                'main_goal' => 'فهم أسباب الاحتباس الحراري وسلوكيات ترشيد الطاقة',
            ],
        ]);

        $response->assertStatus(201);

        $generationId = $response->json('data.id');
        $this->assertDatabaseHas('prompt_generations', [
            'id' => $generationId,
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test prompt generation stores null user_id when guest.
     */
    public function test_prompt_generation_stores_null_user_id_for_guest(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->postJson('/api/v1/generators/educational-content/generate', [
            'inputs' => [
                'content_type' => 'درس تعليمي تفاعلي',
                'topic_title' => 'الذكاء الاصطناعي في التعليم',
                'target_audience' => 'المرحلة الثانوية (15-17 سنة)',
                'delivery_method' => 'نقاش صفي تفاعلي وعرض تقديمي',
                'main_goal' => 'استيعاب إمكانيات الذكاء الاصطناعي التوليدي',
            ],
        ]);

        $response->assertStatus(201);

        $generationId = $response->json('data.id');
        $this->assertDatabaseHas('prompt_generations', [
            'id' => $generationId,
            'user_id' => null,
        ]);
    }

    /**
     * Test listing authenticated user generations.
     */
    public function test_user_can_list_only_their_own_prompt_generations(): void
    {
        $this->seed(DatabaseSeeder::class);
        $generator = PromptGenerator::first();

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create generations for user 1
        PromptGeneration::create([
            'user_id' => $user1->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'User 1 Topic A'],
            'compiled_prompt' => 'Compiled Prompt 1A',
        ]);

        PromptGeneration::create([
            'user_id' => $user1->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'User 1 Topic B'],
            'compiled_prompt' => 'Compiled Prompt 1B',
        ]);

        // Create generation for user 2
        PromptGeneration::create([
            'user_id' => $user2->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'User 2 Topic'],
            'compiled_prompt' => 'Compiled Prompt 2',
        ]);

        $response = $this->actingAs($user1, 'sanctum')->getJson('/api/v1/user/generations');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'meta' => [
                    'total' => 2,
                ],
            ]);

        $data = $response->json('data');
        $this->assertCount(2, $data);
        $this->assertEquals('Compiled Prompt 1B', $data[0]['compiled_prompt']);
    }

    /**
     * Test search filtering on user prompt history.
     */
    public function test_user_can_search_their_prompt_history(): void
    {
        $this->seed(DatabaseSeeder::class);
        $generator = PromptGenerator::first();
        $user = User::factory()->create();

        PromptGeneration::create([
            'user_id' => $user->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'الفلك والفضاء'],
            'compiled_prompt' => 'أمر خاص بعلم الفلك والأبراج السماوية',
        ]);

        PromptGeneration::create([
            'user_id' => $user->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'التاريخ الإسلامي'],
            'compiled_prompt' => 'أمر خاص بعهود الخلافة الراشدة',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/user/generations?search=الفلك');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'meta' => [
                    'total' => 1,
                ],
            ]);
    }

    /**
     * Test single generation retrieval and authorization.
     */
    public function test_single_generation_view_and_authorization(): void
    {
        $this->seed(DatabaseSeeder::class);
        $generator = PromptGenerator::first();

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $gen = PromptGeneration::create([
            'user_id' => $user1->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'Secret Topic'],
            'compiled_prompt' => 'Compiled Secret',
        ]);

        // User 1 can view
        $res1 = $this->actingAs($user1, 'sanctum')->getJson("/api/v1/user/generations/{$gen->id}");
        $res1->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $gen->id,
                    'compiled_prompt' => 'Compiled Secret',
                ],
            ]);

        // User 2 cannot view (403)
        $res2 = $this->actingAs($user2, 'sanctum')->getJson("/api/v1/user/generations/{$gen->id}");
        $res2->assertStatus(403);
    }

    /**
     * Test deleting generation record and authorization.
     */
    public function test_delete_generation_and_authorization(): void
    {
        $this->seed(DatabaseSeeder::class);
        $generator = PromptGenerator::first();

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $gen = PromptGeneration::create([
            'user_id' => $user1->id,
            'generator_id' => $generator->id,
            'inputs_payload' => ['topic' => 'To be deleted'],
            'compiled_prompt' => 'Delete me',
        ]);

        // User 2 cannot delete (403)
        $res2 = $this->actingAs($user2, 'sanctum')->deleteJson("/api/v1/user/generations/{$gen->id}");
        $res2->assertStatus(403);
        $this->assertDatabaseHas('prompt_generations', ['id' => $gen->id]);

        // User 1 can delete
        $res1 = $this->actingAs($user1, 'sanctum')->deleteJson("/api/v1/user/generations/{$gen->id}");
        $res1->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('prompt_generations', ['id' => $gen->id]);
    }
}
