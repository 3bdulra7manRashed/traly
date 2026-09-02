<?php

namespace App\Http\Requests\Api;

use App\Models\PromptGenerator;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GeneratePromptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'inputs' => ['required', 'array'],
        ];

        $slug = $this->route('slug');
        if ($slug) {
            $generator = PromptGenerator::where('slug', $slug)
                ->where('is_active', true)
                ->with('generatorSteps.formFields')
                ->first();

            if ($generator) {
                foreach ($generator->generatorSteps as $step) {
                    foreach ($step->formFields as $field) {
                        if (! empty($field->validation_rules)) {
                            $rules['inputs.'.$field->name] = $field->validation_rules;
                        }
                    }
                }
            }
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        $attributes = [
            'inputs' => 'مدخلات النموذج',
        ];

        $slug = $this->route('slug');
        if ($slug) {
            $generator = PromptGenerator::where('slug', $slug)
                ->where('is_active', true)
                ->with('generatorSteps.formFields')
                ->first();

            if ($generator) {
                foreach ($generator->generatorSteps as $step) {
                    foreach ($step->formFields as $field) {
                        $attributes['inputs.'.$field->name] = $field->label;
                    }
                }
            }
        }

        return $attributes;
    }

    /**
     * Handle a failed validation attempt with consistent JSON wrapper.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'بيانات الإدخال غير صالحة',
            'errors' => $validator->errors(),
        ], 422));
    }
}
