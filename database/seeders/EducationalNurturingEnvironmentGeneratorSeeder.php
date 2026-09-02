<?php

namespace Database\Seeders;

use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Database\Seeder;

class EducationalNurturingEnvironmentGeneratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $template = <<<'MUSTACHE'
أنت مستشار وباحث خبير في تأسيس وتفعيل البيئات والمحاضن التربوية والمراكز الشبابية. مطلوب منك بناء دليل تشغيلي وبرامجي متكامل لتأسيس وإدارة المحضن التربوي التالي:

## بطاقة تعريف المحضن:
- اسم المحضن / النادي: {{environment_name}}
- طبيعة ونطاق المحضن: {{environment_type}}
- الجمهور المستهدف (الجنس والمرحلة): {{target_gender_age}}
- نمط ودورية اللقاءات: {{operational_mode}}
{{#if staff_count}}
- حجم الكادر التربوي والإشرافي المتاح: {{staff_count}} مشرفين
{{/if}}

## المنظومة القيمية المستهدفة:
{{target_values}}

## مؤشرات النجاح والاستقرار:
{{success_indicators}}

## الهيكل التشغيلي والتربوي المطلوب:
1. الفلسفة التربوية للمحضن وأسلوب بناء العلاقة الإيجابية بين المربي والمتربي.
2. الهيكل التنظيمي، الأدوار والمسؤوليات، وتوزيع المهام على الكادر.
3. جدول زمني ونموذج لقاء دوري نموذجي (افتتاح، ورش قيمية، مهارات، ترفيه وتفريغ طاقات، تقويم ختامي).
4. مصفوفة تفعيل القيم في مواقف وسلوكيات يومية عملية.
5. خطة التواصل والشراكة مع أولياء الأمور والأسرة.
MUSTACHE;

        $generator = PromptGenerator::updateOrCreate(
            ['slug' => 'educational-environment'],
            [
                'title' => 'أمر بناء محضن تربوي',
                'icon' => 'home',
                'short_description' => 'تأسيس البيئات والمحاضن والنوادي التربوية وفق هياكل تشغيلية وبرامج قيمية مدروسة.',
                'prompt_template' => $template,
                'is_active' => true,
                'order' => 3,
            ]
        );

        $generator->generatorSteps()->delete();

        // Step 1
        $step1 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'تعريف المحضن والجمهور المستهدف',
            'description' => 'تحديد هوية المحضن، نمط التشغيل، والفئة المستفيدة',
            'step_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'environment_name',
            'label' => 'اسم المحضن أو النادي التربوي',
            'type' => 'text',
            'placeholder' => 'مثال: نادي رواد الغد / ملتقى الفتيات الواعدات',
            'help_text' => 'اسم يعبر عن روح المحضن وأهدافه',
            'options' => null,
            'validation_rules' => ['required', 'string', 'max:255'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'environment_type',
            'label' => 'طبيعة ونطاق المحضن',
            'type' => 'select',
            'placeholder' => 'اختر نوع المحضن',
            'help_text' => 'الإطار المؤسسي أو المكاني للمحضن التربوي',
            'options' => [
                'youth_club' => 'نادي شبابي أسبوعي مستقل',
                'student_center' => 'مركز / نادي مدرسي مصاحب',
                'family_circle' => 'حلقة تربوية أسرية / حي سكني',
                'digital_community' => 'مجتمع تربوي افتراضي تفاعلي',
                'mosque_center' => 'مركز تربوي قرآني / مسجدي',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'target_gender_age',
            'label' => 'الجنس والمرحلة العمرية',
            'type' => 'text',
            'placeholder' => 'مثال: فتيان - المرحلة المتوسطة (13-15 سنة)',
            'help_text' => 'تحديد دقيق للجنس والعمر لتصميم الأنشطة المناسبة',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'operational_mode',
            'label' => 'نمط ودورية اللقاءات',
            'type' => 'radio',
            'placeholder' => null,
            'help_text' => 'وتيرة عقد الجلسات والفعاليات',
            'options' => [
                'weekly' => 'لقاء أسبوعي دوري مكثف',
                'biweekly' => 'لقاء نصف شهري (مرتان شهرياً)',
                'daily_after_school' => 'يومي مسائي بعد انتهاء اليوم المدرسي',
                'intensive_camp' => 'مخيمات ومعسكرات موسمية',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 4,
        ]);

        // Step 2
        $step2 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'المنظومة القيمية والتشغيل',
            'description' => 'تحديد القيم المركزية، كادر الإشراف، ومؤشرات النجاح',
            'step_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'target_values',
            'label' => 'القيم والمفاهيم المركزية المستهدفة',
            'type' => 'textarea',
            'placeholder' => 'مثال: تحمل المسؤولية، الإتقان، بر الوالدين، العمل الجماعي، الإيجابية...',
            'help_text' => 'القيم التي سيتمحور حولها المحتوى والممارسات طوال العام',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'staff_count',
            'label' => 'عدد الكادر التربوي / المشرفين المتاح (اختياري)',
            'type' => 'number',
            'placeholder' => 'مثال: 4',
            'help_text' => 'يسهم في تقسيم المجموعات وتحديد نسب الإشراف',
            'options' => null,
            'validation_rules' => ['nullable', 'numeric', 'min:1'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'success_indicators',
            'label' => 'مؤشرات نجاح واستقرار المحضن',
            'type' => 'textarea',
            'placeholder' => 'كيف نقيس نجاح البيئة التربوية وانضباط المشاركين ونموهم القيمي؟',
            'help_text' => 'معايير واضحة لقياس التطور السلوكي والاستمرارية',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);
    }
}
