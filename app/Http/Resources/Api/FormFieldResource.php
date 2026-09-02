<?php

namespace App\Http\Resources\Api;

use App\Models\FormField;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin FormField
 */
class FormFieldResource extends JsonResource
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
            'name' => $this->name,
            'label' => $this->label,
            'type' => $this->type,
            'placeholder' => $this->placeholder,
            'help_text' => $this->help_text,
            'options' => $this->options,
            'validation_rules' => $this->validation_rules,
            'conditional_rules' => $this->conditional_rules,
            'field_order' => $this->field_order,
        ];
    }
}
