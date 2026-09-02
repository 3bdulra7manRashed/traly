<?php

namespace App\Http\Resources\Api;

use App\Models\PromptGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PromptGenerator
 */
class PromptGeneratorResource extends JsonResource
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
            'icon' => $this->icon,
            'short_description' => $this->short_description,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'steps' => GeneratorStepResource::collection($this->whenLoaded('generatorSteps')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
