<?php

namespace App\Models;

use Database\Factories\PromptGenerationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptGeneration extends Model
{
    /** @use HasFactory<PromptGenerationFactory> */
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
            'inputs_payload' => 'array',
        ];
    }

    /**
     * Get the prompt generator used for this generation.
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
     * Get the user who created this prompt generation.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
