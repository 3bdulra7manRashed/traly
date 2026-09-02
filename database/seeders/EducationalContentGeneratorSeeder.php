<?php

namespace Database\Seeders;

use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Database\Seeder;

class EducationalContentGeneratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $template = <<<'MUSTACHE'
أنت خبير تصميم تعليمي وتربوي رفيع المستوى. مهمتك هي إعداد وصياغة محتوى تعليمي تفاعلي ومتكامل وفق البيانات التالية:

## بيانات المحتوى التعليمي:
- نوع المحتوى: {{content_type}}
- عنوان الموضوع: {{topic_title}}
- الفئة المستهدفة / المرحلة: {{target_audience}}
- أسلوب وطريقة التقديم: {{delivery_method}}

## الهدف التربوي والتعليمي:
{{main_goal}}

{{#if elements_to_include}}
## العناصر المطلوب تضمينها وتأكيدها:
{{elements_to_include}}
{{/if}}

{{#if cautions}}
## محاذير وشروط خاصة:
{{cautions}}
{{/if}}

## تعليمات الصياغة والمخرجات:
1. صياغة المخرجات بلغة عربية فصيحة، واضحة، وجذابة تناسب مستوى الفئة المستهدفة.
2. مراعاة التدرج المعرفي والتفاعلي، وربط المفاهيم بالتطبيق العملي.
3. تقديم هيكل منظم ومنسق بوضوح يشمل المقدمة، متن المحتوى، والأنشطة التقويمية.
MUSTACHE;

        $generator = PromptGenerator::updateOrCreate(
            ['slug' => 'educational-content'],
            [
                'title' => 'أمر بناء محتوى تعليمي',
                'icon' => 'book-open',
                'short_description' => 'توليد وصياغة محتوى تعليمي تفاعلي وخطط دراسية مخصصة وفق معايير تربوية دقيقة.',
                'prompt_template' => $template,
                'is_active' => true,
                'order' => 1,
            ]
        );

        // Clear existing steps if re-seeding
        $generator->generatorSteps()->delete();

        // Step 1
        $step1 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'المعلومات الأساسية للمحتوى',
            'description' => 'تحديد هوية ونوع المادة التعليمية والجمهور المستهدف',
            'step_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'content_type',
            'label' => 'نوع المحتوى التعليمي',
            'type' => 'select',
            'placeholder' => 'اختر نوع المحتوى',
            'help_text' => 'حدد القالب العام للمحتوى المطلوب توليده',
            'options' => [
                'lesson_plan' => 'خطة درس تعليمي',
                'educational_article' => 'مقال تربوي إثرائي',
                'interactive_activity' => 'نشاط تعليمي تفاعلي',
                'assessment_quiz' => 'اختبار تقييمي وقصير',
                'worksheet' => 'ورقة عمل تطبيقية',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'topic_title',
            'label' => 'عنوان الموضوع أو الدرس',
            'type' => 'text',
            'placeholder' => 'مثال: دورة الماء في الطبيعة وأثرها البيئي',
            'help_text' => 'اكتب عنواناً معبراً ومحدداً للموضوع التعليمي',
            'options' => null,
            'validation_rules' => ['required', 'string', 'max:255'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'target_audience',
            'label' => 'الفئة المستهدفة أو المرحلة الدراسية',
            'type' => 'text',
            'placeholder' => 'مثال: طلاب المرحلة الابتدائية (الصف الرابع)',
            'help_text' => 'حدد العمر أو المرحلة لضبط لغة المحتوى وعمقه',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'delivery_method',
            'label' => 'طريقة تقديم المحتوى',
            'type' => 'radio',
            'placeholder' => null,
            'help_text' => 'البيئة التي سيتم تقديم هذا المحتوى من خلالها',
            'options' => [
                'classroom' => 'حضوري في الفصل الدراسي',
                'e_learning' => 'تعليم إلكتروني / عن بعد',
                'blended' => 'تعليم مدمج (حضوري ورقمي)',
                'self_learning' => 'تعلم ذاتي مستقل',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 4,
        ]);

        // Step 2
        $step2 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'الأهداف والعناصر والمحاذير',
            'description' => 'صياغة الأهداف وتحديد العناصر الداعمة للمحتوى',
            'step_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'main_goal',
            'label' => 'الهدف التربوي أو التعليمي الرئيسي',
            'type' => 'textarea',
            'placeholder' => 'ما الذي يتوقع من المتعلم إتقانه أو اكتسابه بنهاية هذا المحتوى؟',
            'help_text' => 'اكتب هدفاً تعليمياً قابلاً للملاحظة والقياس',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'elements_to_include',
            'label' => 'عناصر تفصيلية مطلوب تضمينها',
            'type' => 'multi_checkbox',
            'placeholder' => null,
            'help_text' => 'اختر العناصر التي تريد من الذكاء الاصطناعي إبرازها',
            'options' => [
                'real_life_examples' => 'أمثلة وتطبيقات من واقع الحياة',
                'discussion_questions' => 'أسئلة حوارية وتفكير ناقد',
                'gamification' => 'عناصر تحفيز وتلعيب تعليمي',
                'visual_descriptions' => 'مقترحات لوسائط ورسومات بصرية',
                'summary_takeaways' => 'خلاصة وبطاقة استذكار سريعة',
            ],
            'validation_rules' => ['nullable', 'array'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'cautions',
            'label' => 'محاذير وشروط خاصة (اختياري)',
            'type' => 'textarea',
            'placeholder' => 'مثال: تجنب المصطلحات المعقدة، التركيز على الجانب القيمي والعملي...',
            'help_text' => 'أي قيود أو تفضيلات إضافية ترغب في الالتزام بها',
            'options' => null,
            'validation_rules' => ['nullable', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);
    }
}
