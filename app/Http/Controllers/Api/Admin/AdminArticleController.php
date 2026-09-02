<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminArticleController extends Controller
{
    /**
     * Display a listing of all articles for administration.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::with(['category', 'author'])->latest();

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->has('is_published') && $request->query('is_published') !== '') {
            $query->where('is_published', filter_var($request->query('is_published'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = (int) $request->query('per_page', 15);
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
     * Store a newly created article.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:articles,slug'],
            'category_id' => ['required', 'exists:categories,id'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'keywords' => ['nullable', 'array'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug ?: 'article';
            $count = Article::where('slug', 'like', "{$slug}%")->count();
            $validated['slug'] = $count ? "{$slug}-".($count + 1) : $slug;
        }

        if (! empty($validated['is_published']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $validated['author_id'] = $request->user()->id;

        $article = Article::create($validated);
        $article->load(['category', 'author']);

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article),
            'message' => 'تم إنشاء المقال بنجاح',
        ], 201);
    }

    /**
     * Display the specified article.
     */
    public function show(int $id): JsonResponse
    {
        $article = Article::with(['category', 'author'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article),
            'message' => null,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('articles', 'slug')->ignore($article->id)],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['sometimes', 'required', 'string'],
            'keywords' => ['nullable', 'array'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        if (isset($validated['is_published']) && $validated['is_published'] && empty($article->published_at) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $article->update($validated);
        $article->load(['category', 'author']);

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article),
            'message' => 'تم تحديث المقال بنجاح',
        ]);
    }

    /**
     * Toggle published state of the article.
     */
    public function togglePublish(int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $isPublished = ! $article->is_published;

        $article->update([
            'is_published' => $isPublished,
            'published_at' => $isPublished && ! $article->published_at ? now() : $article->published_at,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $article->id,
                'is_published' => $article->is_published,
                'published_at' => $article->published_at?->toIso8601String(),
            ],
            'message' => $isPublished ? 'تم نشر المقال' : 'تم تحويل المقال إلى مسودة',
        ]);
    }

    /**
     * Remove the specified article.
     */
    public function destroy(int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'تم حذف المقال بنجاح',
        ]);
    }
}
