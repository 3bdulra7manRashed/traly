<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\PromptGenerationResource;
use App\Models\PromptGeneration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserGenerationController extends Controller
{
    /**
     * Display a paginated list of prompt generations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = PromptGeneration::where('user_id', $user->id)
            ->with(['generator:id,title,slug,icon,short_description']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('generator', function ($g) use ($search) {
                    $g->where('title', 'like', "%{$search}%");
                })->orWhere('compiled_prompt', 'like', "%{$search}%");
            });
        }

        $generations = $query->latest('id')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => PromptGenerationResource::collection($generations),
            'meta' => [
                'current_page' => $generations->currentPage(),
                'last_page' => $generations->lastPage(),
                'per_page' => $generations->perPage(),
                'total' => $generations->total(),
            ],
            'message' => null,
        ]);
    }

    /**
     * Display the specified prompt generation for the authenticated user.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $generation = PromptGeneration::with(['generator:id,title,slug,icon,short_description'])
            ->findOrFail($id);

        if ($generation->user_id !== $request->user()->id) {
            abort(403, 'غير مصرح لك بالوصول لهذا السجل.');
        }

        return response()->json([
            'success' => true,
            'data' => new PromptGenerationResource($generation),
            'message' => null,
        ]);
    }

    /**
     * Delete the specified prompt generation record.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $generation = PromptGeneration::findOrFail($id);

        if ($generation->user_id !== $request->user()->id) {
            abort(403, 'غير مصرح لك بحذف هذا السجل.');
        }

        $generation->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'تم حذف السجل بنجاح',
        ]);
    }
}
