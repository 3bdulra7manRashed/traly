<?php

namespace Database\Seeders;

use App\Models\FormField;
use App\Models\GeneratorStep;
use App\Models\PromptGenerator;
use Illuminate\Database\Seeder;

class EducationalInitiativeGeneratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $template = <<<'MUSTACHE'
أنت مستشار استراتيجي وخبير في تصميم وإدارة المبادرات والمشاريع التربوية. مطلوب منك إعداد وثيقة مبادرة تربوية تنفيذية متكاملة بناءً على المعطيات التالية:

## بيانات المبادرة الأساسية:
- اسم المبادرة: {{initiative_name}}
- مسار / نوع المبادرة: {{initiative_type}}
- الفئة العمرية المستهدفة: {{target_age_group}}
- نطاق الميزانية المتاحة: {{available_budget}}

## تشخيص الاحتياج والمشكلة:
{{core_need}}

## المخرجات والنتائج المتوقعة:
{{expected_outcomes}}

{{#if risk_factors}}
## التحديات والمخاطر المتوقعة ومقترحات التجاوز:
{{risk_factors}}
{{/if}}

## متطلبات خطة العمل التنفيذية:
1. صياغة رؤية ورسالة واضحة للمبادرة.
2. وضع 3-5 أهداف استراتيجية وتفصيلية ذكية (SMART).
3. رسم مراحل التنفيذ (التحضير، الإطلاق، التشغيل، التقييم والختام) مع جدول زمني مقترح.
4. مصفوفة مؤشرات الأداء الرئيسية (KPIs) لقياس الأثر التربوي والمجتمعي.
5. خطة إدارة الموارد والكوادر التطوعية.
MUSTACHE;

        $generator = PromptGenerator::updateOrCreate(
            ['slug' => 'educational-initiative'],
            [
                'title' => 'أمر بناء مبادرة تربوية',
                'icon' => 'light-bulb',
                'short_description' => 'تصميم مبادرات ومشاريع تربوية متكاملة الأركان من تحليل الاحتياج وحتى مؤشرات الأداء.',
                'prompt_template' => $template,
                'is_active' => true,
                'order' => 2,
            ]
        );

        $generator->generatorSteps()->delete();

        // Step 1
        $step1 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'الهوية والاحتياج التربوي',
            'description' => 'تحديد مسار المبادرة وتشخيص الفجوة التي تعالجها',
            'step_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'initiative_name',
            'label' => 'اسم المبادرة المقترح',
            'type' => 'text',
            'placeholder' => 'مثال: جيل القراءة الواعي / سفراء القيم الرقمية',
            'help_text' => 'اسم جذاب وملهم يعكس جوهر المبادرة',
            'options' => null,
            'validation_rules' => ['required', 'string', 'max:255'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'initiative_type',
            'label' => 'نوع ومسار المبادرة',
            'type' => 'select',
            'placeholder' => 'اختر مسار المبادرة',
            'help_text' => 'المجال التخصصي الأساسي الذي تركز عليه المبادرة',
            'options' => [
                'values_building' => 'بناء قيمي وأخلاقي',
                'skills_development' => 'تطوير مهارات وقدرات شخصية',
                'academic_enrichment' => 'إثراء علمي وأكاديمي',
                'community_service' => 'خدمة مجتمعية وعمل تطوعي',
                'digital_citizenship' => 'وعي ومواطنة رقمية',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'target_age_group',
            'label' => 'الفئة العمرية المستهدفة',
            'type' => 'text',
            'placeholder' => 'مثال: اليافعون (12-16 سنة) / أولياء الأمور والمربون',
            'help_text' => 'حدد الفئة بوضوح لضمان ملاءمة الأنشطة والوسائل',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);

        FormField::create([
            'step_id' => $step1->id,
            'name' => 'core_need',
            'label' => 'الاحتياج التربوي الأساسي أو المشكلة المعالجة',
            'type' => 'textarea',
            'placeholder' => 'صف الفجوة، السلوك، أو الاحتياج الذي دعت الحاجة لإطلاق هذه المبادرة من أجله...',
            'help_text' => 'التشخيص الدقيق يساعد في توليد حلول نوعية وقابلة للتطبيق',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 4,
        ]);

        // Step 2
        $step2 = GeneratorStep::create([
            'generator_id' => $generator->id,
            'title' => 'المخرجات والموارد والمخاطر',
            'description' => 'تحديد النتائج المرجوة والميزانية المتوقعة وإدارة التحديات',
            'step_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'expected_outcomes',
            'label' => 'المخرجات والنتائج المتوقعة',
            'type' => 'textarea',
            'placeholder' => 'ما هو التغيير أو الأثر الملموس بعد اكتمال تنفيذ المبادرة؟',
            'help_text' => 'مخرجات كمية ونوعية متوقعة',
            'options' => null,
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 1,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'available_budget',
            'label' => 'نطاق الميزانية التقديرية',
            'type' => 'select',
            'placeholder' => 'حدد النطاق المالي للمبادرة',
            'help_text' => 'يحدد مقترحات الأنشطة وفق الإمكانيات المالية',
            'options' => [
                'zero_budget' => 'بدون ميزانية (اعتماد على التطوع والحلول الرقمية المجانية)',
                'low' => 'محدودة (أقل من 5,000 ريال)',
                'medium' => 'متوسطة (5,000 - 20,000 ريال)',
                'high' => 'موسعة (أكثر من 20,000 ريال)',
            ],
            'validation_rules' => ['required', 'string'],
            'conditional_rules' => null,
            'field_order' => 2,
        ]);

        FormField::create([
            'step_id' => $step2->id,
            'name' => 'risk_factors',
            'label' => 'التحديات والمخاطر المحتملة (اختياري)',
            'type' => 'textarea',
            'placeholder' => 'مثل: ضعف الإقبال، ضيق الوقت، شح الكوادر المتخصصة...',
            'help_text' => 'سيتم وضع خطط بديلة واحترازية لمعالجتها',
            'options' => null,
            'validation_rules' => ['nullable', 'string'],
            'conditional_rules' => null,
            'field_order' => 3,
        ]);
    }
}
