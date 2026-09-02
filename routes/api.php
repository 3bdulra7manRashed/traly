<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\PromptGeneratorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Prompt Generators
    Route::get('/generators', [PromptGeneratorController::class, 'index'])->name('api.v1.generators.index');
    Route::get('/generators/{slug}', [PromptGeneratorController::class, 'show'])->name('api.v1.generators.show');
    Route::post('/generators/{slug}/generate', [PromptGeneratorController::class, 'generate'])->name('api.v1.generators.generate');

    // Articles & Categories
    Route::get('/articles', [ArticleController::class, 'index'])->name('api.v1.articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('api.v1.articles.show');
    Route::get('/categories', [ArticleController::class, 'categories'])->name('api.v1.categories.index');
});
