<?php

namespace App\Http\Resources\Api;

use App\Models\GeneratorStep;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin GeneratorStep
 */
class GeneratorStepResource extends JsonResource
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
            'description' => $this->description,
            'step_order' => $this->step_order,
            'fields' => FormFieldResource::collection($this->whenLoaded('formFields')),
        ];
    }
}
