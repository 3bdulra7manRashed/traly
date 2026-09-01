<?php

namespace App\Models;

use Database\Factories\GeneratorStepFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeneratorStep extends Model
{
    /** @use HasFactory<GeneratorStepFactory> */
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
            'step_order' => 'integer',
        ];
    }

    /**
     * Get the prompt generator that owns this step.
     *
     * @return BelongsTo<PromptGenerator, $this>
     */
    public function promptGenerator(): BelongsTo
    {
        return $this->belongsTo(PromptGenerator::class, 'generator_id');
    }

    /**
     * Alias for promptGenerator relation.
     *
     * @return BelongsTo<PromptGenerator, $this>
     */
    public function generator(): BelongsTo
    {
        return $this->promptGenerator();
    }

    /**
     * Get the form fields for this step ordered by field_order.
     *
     * @return HasMany<FormField, $this>
     */
    public function formFields(): HasMany
    {
        return $this->hasMany(FormField::class, 'step_id')->orderBy('field_order');
    }

    /**
     * Alias for formFields relation.
     *
     * @return HasMany<FormField, $this>
     */
    public function fields(): HasMany
    {
        return $this->formFields();
    }
}
