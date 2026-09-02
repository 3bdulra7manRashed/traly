<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\PromptGeneration;
use App\Models\PromptGenerator;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    /**
     * Get platform analytical statistics and recent activities.
     */
    public function index(): JsonResponse
    {
        $totalArticles = Article::count();
        $publishedArticles = Article::where('is_published', true)->count();
        $totalGenerators = PromptGenerator::count();
        $activeGenerators = PromptGenerator::where('is_active', true)->count();
        $totalGenerations = PromptGeneration::count();
        $totalCategories = Category::count();

        $recentGenerations = PromptGeneration::with(['promptGenerator:id,title,slug,icon', 'user:id,name,email'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function (PromptGeneration $generation) {
                return [
                    'id' => $generation->id,
                    'generator_title' => $generation->promptGenerator?->title ?? 'أمر محذوف',
                    'generator_slug' => $generation->promptGenerator?->slug,
                    'generator_icon' => $generation->promptGenerator?->icon,
                    'user_name' => $generation->user?->name ?? 'زائر (مجهول)',
                    'inputs_preview' => $generation->inputs_payload,
                    'created_at' => $generation->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_articles' => $totalArticles,
                'published_articles' => $publishedArticles,
                'total_generators' => $totalGenerators,
                'active_generators' => $activeGenerators,
                'total_generations' => $totalGenerations,
                'total_categories' => $totalCategories,
                'recent_generations' => $recentGenerations,
            ],
            'message' => null,
        ]);
    }
}
