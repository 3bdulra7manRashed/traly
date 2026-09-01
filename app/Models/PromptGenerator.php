<?php

namespace App\Models;

use Database\Factories\PromptGeneratorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class PromptGenerator extends Model
{
    /** @use HasFactory<PromptGeneratorFactory> */
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = ['id'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Get the generator steps ordered by step_order.
     *
     * @return HasMany<GeneratorStep, $this>
     */
    public function generatorSteps(): HasMany
    {
        return $this->hasMany(GeneratorStep::class, 'generator_id')->orderBy('step_order');
    }

    /**
     * Alias for generatorSteps relation.
     *
     * @return HasMany<GeneratorStep, $this>
     */
    public function steps(): HasMany
    {
        return $this->generatorSteps();
    }

    /**
     * Get all form fields through generator steps.
     *
     * @return HasManyThrough<FormField, GeneratorStep, $this>
     */
    public function formFields(): HasManyThrough
    {
        return $this->hasManyThrough(FormField::class, GeneratorStep::class, 'generator_id', 'step_id');
    }

    /**
     * Get all prompt generations for this generator.
     *
     * @return HasMany<PromptGeneration, $this>
     */
    public function promptGenerations(): HasMany
    {
        return $this->hasMany(PromptGeneration::class, 'generator_id');
    }

    /**
     * Alias for promptGenerations relation.
     *
     * @return HasMany<PromptGeneration, $this>
     */
    public function generations(): HasMany
    {
        return $this->promptGenerations();
    }
}
