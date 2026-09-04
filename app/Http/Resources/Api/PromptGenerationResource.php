<?php

namespace App\Http\Resources\Api;

use App\Models\PromptGeneration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PromptGeneration
 */
class PromptGenerationResource extends JsonResource
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
            'generator_id' => $this->generator_id,
            'generator' => $this->whenLoaded('generator', function () {
                return [
                    'id' => $this->generator->id,
                    'title' => $this->generator->title,
                    'slug' => $this->generator->slug,
                    'icon' => $this->generator->icon,
                    'short_description' => $this->generator->short_description,
                ];
            }),
            'inputs_payload' => $this->inputs_payload,
            'compiled_prompt' => $this->compiled_prompt,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
