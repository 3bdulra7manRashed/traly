<?php

namespace App\Http\Resources\Api;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Article
 */
class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image_url' => $this->image_url,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'keywords' => $this->keywords ?? [],
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ];
            }),
            'related_articles' => ArticleResource::collection($this->when(
                isset($this->additional['related_articles']),
                fn () => $this->additional['related_articles'] ?? []
            )),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
