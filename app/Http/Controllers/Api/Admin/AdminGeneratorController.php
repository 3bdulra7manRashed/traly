<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\PromptGeneratorResource;
use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminGeneratorController extends Controller
{
    /**
     * Display a listing of all prompt generators.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PromptGenerator::with(['generatorSteps.formFields'])->orderBy('order');

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->query('is_active') !== '') {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $generators = $query->get();

        return response()->json([
            'success' => true,
            'data' => PromptGeneratorResource::collection($generators),
            'message' => null,
        ]);
    }

    /**
     * Store a newly created generator with nested steps and fields.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:prompt_generators,slug'],
            'icon' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string'],
            'prompt_template' => ['required', 'string'],
            'is_active' => ['boolean'],
            'order' => ['integer'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*.title' => ['required', 'string', 'max:255'],
            'steps.*.description' => ['nullable', 'string'],
            'steps.*.step_order' => ['integer'],
            'steps.*.fields' => ['required', 'array', 'min:1'],
            'steps.*.fields.*.name' => ['required', 'string', 'max:100'],
            'steps.*.fields.*.label' => ['required', 'string', 'max:255'],
            'steps.*.fields.*.type' => ['required', 'string', 'in:text,textarea,select,radio,multi_checkbox,boolean,number'],
            'steps.*.fields.*.placeholder' => ['nullable', 'string', 'max:255'],
            'steps.*.fields.*.help_text' => ['nullable', 'string'],
            'steps.*.fields.*.options' => ['nullable'],
            'steps.*.fields.*.validation_rules' => ['nullable', 'array'],
            'steps.*.fields.*.conditional_rules' => ['nullable', 'array'],
            'steps.*.fields.*.field_order' => ['integer'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug ?: 'generator';
            $count = PromptGenerator::where('slug', 'like', "{$slug}%")->count();
            $validated['slug'] = $count ? "{$slug}-".($count + 1) : $slug;
        }

        $generator = DB::transaction(function () use ($validated) {
            $generator = PromptGenerator::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'icon' => $validated['icon'] ?? 'sparkles',
                'short_description' => $validated['short_description'] ?? null,
                'prompt_template' => $validated['prompt_template'],
                'is_active' => $validated['is_active'] ?? true,
                'order' => $validated['order'] ?? 0,
            ]);

            foreach ($validated['steps'] as $stepIdx => $stepData) {
                $step = GeneratorStep::create([
                    'generator_id' => $generator->id,
                    'title' => $stepData['title'],
                    'description' => $stepData['description'] ?? null,
                    'step_order' => $stepData['step_order'] ?? ($stepIdx + 1),
                ]);

                foreach ($stepData['fields'] as $fieldIdx => $fieldData) {
                    $options = $fieldData['options'] ?? null;
                    // Format options if passed as array of strings
                    if (is_array($options) && array_is_list($options)) {
                        $formattedOptions = [];
                        foreach ($options as $opt) {
                            $formattedOptions[Str::slug($opt, '_')] = $opt;
                        }
                        $options = $formattedOptions;
                    }

                    FormField::create([
                        'step_id' => $step->id,
                        'name' => $fieldData['name'],
                        'label' => $fieldData['label'],
                        'type' => $fieldData['type'],
                        'placeholder' => $fieldData['placeholder'] ?? null,
                        'help_text' => $fieldData['help_text'] ?? null,
                        'options' => $options,
                        'validation_rules' => $fieldData['validation_rules'] ?? null,
                        'conditional_rules' => $fieldData['conditional_rules'] ?? null,
                        'field_order' => $fieldData['field_order'] ?? ($fieldIdx + 1),
                    ]);
                }
            }

            return $generator;
        });

        $generator->load('generatorSteps.formFields');

        return response()->json([
            'success' => true,
            'data' => new PromptGeneratorResource($generator),
            'message' => 'تم إنشاء الأمر الذكي بنجاح',
        ], 201);
    }

    /**
     * Display the specified prompt generator.
     */
    public function show(int $id): JsonResponse
    {
        $generator = PromptGenerator::with(['generatorSteps.formFields'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new PromptGeneratorResource($generator),
            'message' => null,
        ]);
    }

    /**
     * Update the specified generator with nested steps and fields.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $generator = PromptGenerator::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('prompt_generators', 'slug')->ignore($generator->id)],
            'icon' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string'],
            'prompt_template' => ['sometimes', 'required', 'string'],
            'is_active' => ['boolean'],
            'order' => ['integer'],
            'steps' => ['sometimes', 'array', 'min:1'],
            'steps.*.title' => ['required_with:steps', 'string', 'max:255'],
            'steps.*.description' => ['nullable', 'string'],
            'steps.*.step_order' => ['integer'],
            'steps.*.fields' => ['required_with:steps', 'array', 'min:1'],
            'steps.*.fields.*.name' => ['required_with:steps', 'string', 'max:100'],
            'steps.*.fields.*.label' => ['required_with:steps', 'string', 'max:255'],
            'steps.*.fields.*.type' => ['required_with:steps', 'string', 'in:text,textarea,select,radio,multi_checkbox,boolean,number'],
            'steps.*.fields.*.placeholder' => ['nullable', 'string', 'max:255'],
            'steps.*.fields.*.help_text' => ['nullable', 'string'],
            'steps.*.fields.*.options' => ['nullable'],
            'steps.*.fields.*.validation_rules' => ['nullable', 'array'],
            'steps.*.fields.*.conditional_rules' => ['nullable', 'array'],
            'steps.*.fields.*.field_order' => ['integer'],
        ]);

        DB::transaction(function () use ($generator, $validated) {
            $generator->update([
                'title' => $validated['title'] ?? $generator->title,
                'slug' => $validated['slug'] ?? $generator->slug,
                'icon' => array_key_exists('icon', $validated) ? $validated['icon'] : $generator->icon,
                'short_description' => array_key_exists('short_description', $validated) ? $validated['short_description'] : $generator->short_description,
                'prompt_template' => $validated['prompt_template'] ?? $generator->prompt_template,
                'is_active' => array_key_exists('is_active', $validated) ? $validated['is_active'] : $generator->is_active,
                'order' => array_key_exists('order', $validated) ? $validated['order'] : $generator->order,
            ]);

            // If steps array is provided, replace/synchronize
            if (isset($validated['steps'])) {
                $generator->generatorSteps()->delete();

                foreach ($validated['steps'] as $stepIdx => $stepData) {
                    $step = GeneratorStep::create([
                        'generator_id' => $generator->id,
                        'title' => $stepData['title'],
                        'description' => $stepData['description'] ?? null,
                        'step_order' => $stepData['step_order'] ?? ($stepIdx + 1),
                    ]);

                    foreach ($stepData['fields'] as $fieldIdx => $fieldData) {
                        $options = $fieldData['options'] ?? null;
                        if (is_array($options) && array_is_list($options)) {
                            $formattedOptions = [];
                            foreach ($options as $opt) {
                                $formattedOptions[Str::slug($opt, '_')] = $opt;
                            }
                            $options = $formattedOptions;
                        }

                        FormField::create([
                            'step_id' => $step->id,
                            'name' => $fieldData['name'],
                            'label' => $fieldData['label'],
                            'type' => $fieldData['type'],
                            'placeholder' => $fieldData['placeholder'] ?? null,
                            'help_text' => $fieldData['help_text'] ?? null,
                            'options' => $options,
                            'validation_rules' => $fieldData['validation_rules'] ?? null,
                            'conditional_rules' => $fieldData['conditional_rules'] ?? null,
                            'field_order' => $fieldData['field_order'] ?? ($fieldIdx + 1),
                        ]);
                    }
                }
            }
        });

        $generator->load('generatorSteps.formFields');

        return response()->json([
            'success' => true,
            'data' => new PromptGeneratorResource($generator),
            'message' => 'تم تحديث الأمر الذكي بنجاح',
        ]);
    }

    /**
     * Toggle active status of generator.
     */
    public function toggleActive(int $id): JsonResponse
    {
        $generator = PromptGenerator::findOrFail($id);
        $isActive = ! $generator->is_active;

        $generator->update(['is_active' => $isActive]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $generator->id,
                'is_active' => $generator->is_active,
            ],
            'message' => $isActive ? 'تم تفعيل الأمر الذكي' : 'تم تعطيل الأمر الذكي',
        ]);
    }

    /**
     * Remove the specified generator.
     */
    public function destroy(int $id): JsonResponse
    {
        $generator = PromptGenerator::findOrFail($id);
        $generator->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'تم حذف الأمر الذكي بنجاح',
        ]);
    }
}
