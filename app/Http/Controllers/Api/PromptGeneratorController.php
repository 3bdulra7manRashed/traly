<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\GeneratePromptRequest;
use App\Http\Resources\Api\PromptGeneratorResource;
use App\Models\PromptGeneration;
use App\Models\PromptGenerator;
use App\Services\PromptCompilerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromptGeneratorController extends Controller
{
    public function __construct(
        protected PromptCompilerService $compilerService
    ) {}

    /**
     * List all active prompt generators.
     */
    public function index(Request $request): JsonResponse
    {
        $generators = PromptGenerator::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => PromptGeneratorResource::collection($generators),
            'message' => null,
        ]);
    }

    /**
     * Show a single prompt generator with its steps and fields.
     */
    public function show(string $slug): JsonResponse
    {
        $generator = PromptGenerator::where('slug', $slug)
            ->where('is_active', true)
            ->with(['generatorSteps.formFields'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => new PromptGeneratorResource($generator),
            'message' => null,
        ]);
    }

    /**
     * Compile and record a prompt generation.
     */
    public function generate(GeneratePromptRequest $request, string $slug): JsonResponse
    {
        $generator = PromptGenerator::where('slug', $slug)
            ->where('is_active', true)
            ->with(['generatorSteps.formFields'])
            ->firstOrFail();

        $inputs = (array) $request->validated('inputs', []);

        $compiledPrompt = $this->compilerService->compile(
            $generator->prompt_template,
            $inputs
        );

        $promptGeneration = PromptGeneration::create([
            'user_id' => $request->user()?->id,
            'generator_id' => $generator->id,
            'inputs_payload' => $inputs,
            'compiled_prompt' => $compiledPrompt,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $promptGeneration->id,
                'generator_slug' => $generator->slug,
                'compiled_prompt' => $compiledPrompt,
                'inputs' => $promptGeneration->inputs_payload,
                'created_at' => $promptGeneration->created_at->toIso8601String(),
            ],
            'message' => 'تم توليد الأمر بنجاح',
        ], 201);
    }
}
