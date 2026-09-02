<?php

namespace App\Services;

class PromptCompilerService
{
    /**
     * Compile a prompt template using provided inputs.
     *
     * @param  array<string, mixed>  $data
     */
    public function compile(string $template, array $data): string
    {
        // 1. Standardize newlines
        $template = str_replace(["\r\n", "\r"], "\n", $template);

        // 2. Process conditional blocks: {{#if key}}...{{/if}}
        $compiled = $this->processConditionals($template, $data);

        // 3. Process variable interpolations: {{key}}
        $compiled = $this->processVariables($compiled, $data);

        // 4. Clean up any remaining unresolved tags
        $compiled = $this->cleanRemainingTags($compiled);

        // 5. Format and normalize whitespace
        return $this->formatOutput($compiled);
    }

    /**
     * Process conditional blocks: {{#if key}}...{{/if}} recursively/iteratively.
     *
     * @param  array<string, mixed>  $data
     */
    protected function processConditionals(string $template, array $data): string
    {
        $pattern = '/(?:^[ \t]*)?\{\{#if\s+([a-zA-Z0-9_\.\-]+)\}\}\n?(.*?)\n?(?:^[ \t]*)?\{\{\/if\}\}\n?/sm';
        $maxDepth = 10;

        // Loop while conditionals exist (up to max nesting depth)
        while ($maxDepth-- > 0 && preg_match($pattern, $template)) {
            $template = (string) preg_replace_callback($pattern, function (array $matches) use ($data) {
                $key = trim($matches[1]);
                $innerContent = $matches[2];

                $value = $data[$key] ?? null;

                if ($this->isTruthy($value)) {
                    return $innerContent."\n";
                }

                return '';
            }, $template);
        }

        return $template;
    }

    /**
     * Check if a value is considered truthy for template conditionals.
     */
    protected function isTruthy(mixed $value): bool
    {
        if ($value === null || $value === false) {
            return false;
        }

        if (is_string($value) && trim($value) === '') {
            return false;
        }

        if (is_array($value) && count($value) === 0) {
            return false;
        }

        return true;
    }

    /**
     * Interpolate variables {{key}} with matching data values.
     *
     * @param  array<string, mixed>  $data
     */
    protected function processVariables(string $template, array $data): string
    {
        $pattern = '/\{\{([a-zA-Z0-9_\.\-]+)\}\}/';

        return (string) preg_replace_callback($pattern, function (array $matches) use ($data) {
            $key = trim($matches[1]);

            if (! array_key_exists($key, $data)) {
                return '';
            }

            $value = $data[$key];

            return $this->stringifyValue($value);
        }, $template);
    }

    /**
     * Convert any supported value to its string representation.
     */
    protected function stringifyValue(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? 'نعم' : 'لا';
        }

        if (is_array($value)) {
            // Join array items with Arabic comma '، '
            $cleaned = array_filter(array_map(function ($item) {
                return is_scalar($item) ? trim((string) $item) : '';
            }, $value), fn ($item) => $item !== '');

            return implode('، ', $cleaned);
        }

        return (string) $value;
    }

    /**
     * Strip any remaining unpopulated tags like {{tag}}.
     */
    protected function cleanRemainingTags(string $content): string
    {
        return (string) preg_replace('/\{\{[^}]*\}\}/', '', $content);
    }

    /**
     * Normalize line breaks and trim extra whitespace.
     */
    protected function formatOutput(string $content): string
    {
        // Remove trailing spaces and tabs on each line
        $content = (string) preg_replace('/[ \t]+$/m', '', $content);

        // Normalize 3 or more consecutive newlines into exactly 2 newlines
        $content = (string) preg_replace("/\n{3,}/", "\n\n", $content);

        return trim($content);
    }
}
