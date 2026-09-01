<?php

namespace App\Models;

use Database\Factories\FormFieldFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    /** @use HasFactory<FormFieldFactory> */
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
            'options' => 'array',
            'validation_rules' => 'array',
            'conditional_rules' => 'array',
            'field_order' => 'integer',
        ];
    }

    /**
     * Get the generator step that owns this form field.
     *
     * @return BelongsTo<GeneratorStep, $this>
     */
    public function generatorStep(): BelongsTo
    {
        return $this->belongsTo(GeneratorStep::class, 'step_id');
    }

    /**
     * Alias for generatorStep relation.
     *
     * @return BelongsTo<GeneratorStep, $this>
     */
    public function step(): BelongsTo
    {
        return $this->generatorStep();
    }
}
