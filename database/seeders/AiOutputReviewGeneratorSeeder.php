<?php

namespace Database\Seeders;

use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Database\Seeder;

class AiOutputReviewGeneratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $template = <<<'MUSTACHE'
أنت مدقق تربوي وخبير في مراجعة وتجويد المحتوى التعليمي والمخرجات الرقمية المولدة بالذكاء الاصطناعي. المطلوب منك إجراء تدقيق ومراجعة نقدية دقيقة للنص المرفق أدناه:

## بطاقة المحتوى المراد مراجعته:
- نوع المحتوى الأصلي: {{content_type}}
- الفئة المستهدفة بالنص: {{target_audience}}
- صيغة تقرير المراجعة المطلوبة: {{output_format}}

## معايير التدقيق والمراجعة المعتمدة:
{{review_criteria}}

## النص المراد مراجعته وتدقيقه:
"""
{{ai_output_text}}
"""

## محاور تقرير المراجعة والتدقيق:
1. التقييم الإجمالي للنص وتحديد مدى ملاءمته للفئة العمرية المستهدفة والهدف التعليمي.
2. فحص المعايير المحددة (الدقة العلمية، السلامة التربوية، الاتساق القيمي، سلامة اللغة).
3. بيان نقاط القوة والتميز في النص.
4. بيان الملاحظات، الثغرات، أو المخاطر التربوية والمفاهيمية مع تعليل كل ملاحظة.
5. تقديم الصياغة البديلة والمعدلة والمصححة بالكامل لتكون جاهزة للاستخدام التربوي المباشر.
MUSTACHE;

        $generator = PromptGenerator::updateOrCreate(
            ['slug' => 'ai-output-review'],
            [
                'title' => 'أمر مراجعة مخرجات الذكاء الاصطناعي',
                'icon' => 'check-badge',
                'short_description' => 'تدقيق ومراجعة نصوص ومخرجات الذكاء الاصطناعي من الناحية التربوية، العلمية، والقيمية.',
                'prompt_template' => $template,
                'is_active' => true,
                'order' => 4,
            ]
        );

        $generator->generatorSteps()->delete();

        // Step 1
        $step1 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'المحتوى والجمهور المستهدف',
            'description' => 'إدراج النص المولد بالذكاء الاصطناعي وتحديد سياقه ونوعه',
            'step_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'ai_output_text',
            'label' => 'النص أو المخرج المولد بالذكاء الاصطناعي',
            'type' => 'textarea',
            'placeholder' => 'الصق هنا النص الكامل الذي ترغب في تدقيقه ومراجعته تربوياً ولغوياً...',
            'help_text' => 'النص الذي تم توليده عبر ChatGPT أو Claude أو أي أداة ذكاء اصطناعي أخرى',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'content_type',
            'label' => 'نوع وطبيعة المحتوى الأصلي',
            'type' => 'select',
            'placeholder' => 'اختر طبيعة المحتوى',
            'help_text' => 'يساعد المدقق في تطبيق معايير النوع المحدد',
            'options' => [
                'educational_explanation' => 'شرح مفهوم أو درس تعليمي',
                'story_scenario' => 'قصة أو سيناريو تربوي / حواري',
                'curriculum_summary' => 'تلخيص منهج أو مادة دراسية',
                'activity_guide' => 'دليل نشاط تفاعلي أو تجربة',
                'consultation_response' => 'استشارة أو توجيه سلوكي',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'target_audience',
            'label' => 'الفئة المستهدفة بهذا النص',
            'type' => 'text',
            'placeholder' => 'مثال: أطفال مرحلة الطفولة المبكرة / ناشئة / معلمون',
            'help_text' => 'يُبنى عليه تدقيق السلامة النفسية والمعرفية ومستوى اللغة',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);

        // Step 2
        $step2 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'معايير التدقيق وصيغة المخرج',
            'description' => 'تحديد أبعاد المراجعة المطلوبة وطريقة عرض تقرير التدقيق',
            'step_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'review_criteria',
            'label' => 'معايير التدقيق المطلوبة',
            'type' => 'multi_checkbox',
            'placeholder' => null,
            'help_text' => 'حدد الجوانب التي ترغب في التركيز عليها خلال المراجعة',
            'options' => [
                'scientific_accuracy' => 'الدقة العلمية وصحة المفاهيم والمعلومات',
                'pedagogical_safety' => 'السلامة التربوية ومناسبة المحتوى للعمر والنمو',
                'values_consistency' => 'الاتساق القيمي، الأخلاقي، والهوية الإسلامية',
                'language_clarity' => 'سلامة اللغة العربية، البلاغة، والأسلوب الأدبي',
                'engagement_level' => 'مستوى الجاذبية والتشويق والتفاعل',
            ],
            'validation_rules' => ['required', 'array'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'output_format',
            'label' => 'صيغة تقرير المراجعة المطلوبة',
            'type' => 'radio',
            'placeholder' => null,
            'help_text' => 'الطريقة المفضلة لعرض نتائج المراجعة والتصويب',
            'options' => [
                'detailed_audit' => 'تقرير تفصيلي تحليلي (نقاط قوة، ملاحظات، وبدائل مقترحة)',
                'inline_correction' => 'النص مصوباً ومعدلاً مباشرة مع إبراز وتلوين التغييرات',
                'rubric_evaluation' => 'جدول تقييم معياري مع درجات ومصفوفة ملاحظات',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);
    }
}
