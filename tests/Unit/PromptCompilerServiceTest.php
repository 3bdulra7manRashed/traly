<?php

namespace Tests\Unit;

use App\Services\PromptCompilerService;
use PHPUnit\Framework\TestCase;

class PromptCompilerServiceTest extends TestCase
{
    public function test_variable_interpolation(): void
    {
        $compiler = new PromptCompilerService;
        $template = 'Hello {{name}}, welcome to {{course}}!';
        $data = ['name' => 'Sara', 'course' => 'AI in Education'];

        $result = $compiler->compile($template, $data);

        $this->assertEquals('Hello Sara, welcome to AI in Education!', $result);
    }

    public function test_array_interpolation_with_arabic_comma(): void
    {
        $compiler = new PromptCompilerService;
        $template = 'Topics: {{topics}}';
        $data = ['topics' => ['Math', 'Physics', 'Biology']];

        $result = $compiler->compile($template, $data);

        $this->assertEquals('Topics: Math، Physics، Biology', $result);
    }

    public function test_boolean_interpolation(): void
    {
        $compiler = new PromptCompilerService;
        $template = 'Active: {{is_active}}';
        $data = ['is_active' => true];

        $result = $compiler->compile($template, $data);

        $this->assertEquals('Active: نعم', $result);
    }

    public function test_conditional_block_present_and_truthy(): void
    {
        $compiler = new PromptCompilerService;
        $template = "Header\n{{#if notes}}\nNotes: {{notes}}\n{{/if}}\nFooter";
        $data = ['notes' => 'Important warning!'];

        $result = $compiler->compile($template, $data);

        $this->assertEquals("Header\nNotes: Important warning!\nFooter", $result);
    }

    public function test_conditional_block_missing_or_empty(): void
    {
        $compiler = new PromptCompilerService;
        $template = "Header\n{{#if notes}}\nNotes: {{notes}}\n{{/if}}\n{{#if empty_arr}}\nEmpty: {{empty_arr}}\n{{/if}}\nFooter";
        $data = ['notes' => '', 'empty_arr' => []];

        $result = $compiler->compile($template, $data);

        $this->assertEquals("Header\nFooter", $result);
    }

    public function test_unpopulated_tags_cleanup_and_whitespace_normalization(): void
    {
        $compiler = new PromptCompilerService;
        $template = "Title: {{title}}\n\n\n\nUnknown: {{unknown_tag}}\n\nEnd: {{end}}";
        $data = ['title' => 'Sample', 'end' => 'Done'];

        $result = $compiler->compile($template, $data);

        $this->assertEquals("Title: Sample\n\nUnknown:\n\nEnd: Done", $result);
    }
}
