<?php

use App\Http\Controllers\Api\Admin\AdminArticleController;
use App\Http\Controllers\Api\Admin\AdminGeneratorController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PromptGeneratorController;
use App\Http\Controllers\Api\UserGenerationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication Routes
    Route::post('/auth/register', [AuthController::class, 'register'])->name('api.v1.auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.v1.auth.login');

    // Public Prompt Generators
    Route::get('/generators', [PromptGeneratorController::class, 'index'])->name('api.v1.generators.index');
    Route::get('/generators/{slug}', [PromptGeneratorController::class, 'show'])->name('api.v1.generators.show');
    Route::post('/generators/{slug}/generate', [PromptGeneratorController::class, 'generate'])->name('api.v1.generators.generate');

    // Public Articles & Categories
    Route::get('/articles', [ArticleController::class, 'index'])->name('api.v1.articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('api.v1.articles.show');
    Route::get('/categories', [ArticleController::class, 'categories'])->name('api.v1.categories.index');

    // Protected Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
        Route::get('/auth/me', [AuthController::class, 'me'])->name('api.v1.auth.me');

        // User Profile
        Route::get('/user/profile', [AuthController::class, 'me'])->name('api.v1.user.profile');
        Route::put('/user/profile', [AuthController::class, 'updateProfile'])->name('api.v1.user.profile.update');

        // User Generation History
        Route::get('/user/generations', [UserGenerationController::class, 'index'])->name('api.v1.user.generations.index');
        Route::get('/user/generations/{id}', [UserGenerationController::class, 'show'])->name('api.v1.user.generations.show');
        Route::delete('/user/generations/{id}', [UserGenerationController::class, 'destroy'])->name('api.v1.user.generations.destroy');

        // Admin Management Routes
        Route::prefix('admin')->name('api.v1.admin.')->group(function () {
            // Stats
            Route::get('/stats', [AdminStatsController::class, 'index'])->name('stats');

            // Categories
            Route::get('/categories', [ArticleController::class, 'categories'])->name('categories.index');

            // Articles Management
            Route::get('/articles', [AdminArticleController::class, 'index'])->name('articles.index');
            Route::post('/articles', [AdminArticleController::class, 'store'])->name('articles.store');
            Route::get('/articles/{id}', [AdminArticleController::class, 'show'])->name('articles.show');
            Route::match(['put', 'patch'], '/articles/{id}', [AdminArticleController::class, 'update'])->name('articles.update');
            Route::patch('/articles/{id}/toggle-publish', [AdminArticleController::class, 'togglePublish'])->name('articles.toggle-publish');
            Route::delete('/articles/{id}', [AdminArticleController::class, 'destroy'])->name('articles.destroy');

            // Generator Builder Management
            Route::get('/generators', [AdminGeneratorController::class, 'index'])->name('generators.index');
            Route::post('/generators', [AdminGeneratorController::class, 'store'])->name('generators.store');
            Route::get('/generators/{id}', [AdminGeneratorController::class, 'show'])->name('generators.show');
            Route::match(['put', 'patch'], '/generators/{id}', [AdminGeneratorController::class, 'update'])->name('generators.update');
            Route::patch('/generators/{id}/toggle-active', [AdminGeneratorController::class, 'toggleActive'])->name('generators.toggle-active');
            Route::delete('/generators/{id}', [AdminGeneratorController::class, 'destroy'])->name('generators.destroy');
        });
    });
});
