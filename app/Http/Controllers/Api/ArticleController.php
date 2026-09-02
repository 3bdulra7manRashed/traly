<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ArticleResource;
use App\Http\Resources\Api\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a paginated listing of published articles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::where('is_published', true)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->latest('published_at');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 10);
        $articles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
            'message' => null,
        ]);
    }

    /**
     * Display the specified published article with related articles.
     */
    public function show(string $slug): JsonResponse
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->where('published_at', '<=', now())
            ->with(['category', 'author'])
            ->firstOrFail();

        $related = Article::where('is_published', true)
            ->where('published_at', '<=', now())
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with(['category', 'author'])
            ->latest('published_at')
            ->take(3)
            ->get();

        $articleResource = (new ArticleResource($article))->additional([
            'related_articles' => $related,
        ]);

        return response()->json([
            'success' => true,
            'data' => $articleResource,
            'message' => null,
        ]);
    }

    /**
     * Display a listing of categories with article counts.
     */
    public function categories(): JsonResponse
    {
        $categories = Category::withCount(['articles' => function ($q) {
            $q->where('is_published', true)
                ->where('published_at', '<=', now());
        }])->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
            'message' => null,
        ]);
    }
}
