<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@traly.sa'],
            [
                'name' => 'مدير منصة ترالي',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Knowledge Categories
        $categoriesData = [
            [
                'name' => 'التربية والذكاء الاصطناعي',
                'slug' => 'education-and-ai',
                'description' => 'استراتيجيات توظيف أدوات ونماذج الذكاء الاصطناعي في التعليم والتوجيه التربوي والقيمي.',
            ],
            [
                'name' => 'بناء المناهج وتصميم التعليم',
                'slug' => 'curriculum-and-instructional-design',
                'description' => 'نظريات ونماذج التصميم التعليمي الحديثة، وتحويل الأهداف المعرفية إلى تجارب تفاعلية.',
            ],
            [
                'name' => 'إدارة البيئات والمحاضن التربوية',
                'slug' => 'educational-environments-management',
                'description' => 'أفضل الممارسات في تأسيس وإدارة النوادي الشبابية والبيئات التربوية المحفزة.',
            ],
            [
                'name' => 'المبادرات والابتكار التعليمي',
                'slug' => 'initiatives-and-educational-innovation',
                'description' => 'منهجيات بناء المشاريع التربوية الريادية وقياس الأثر والمؤشرات المجتمعية.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $categories[$catData['slug']] = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // 3. Seed Articles
        $articles = [
            [
                'category_slug' => 'education-and-ai',
                'title' => 'كيف نصمم أوامر ذكاء اصطناعي (Prompts) فعالة في السياق التربوي؟',
                'slug' => 'effective-prompt-engineering-in-education',
                'excerpt' => 'دليل عملي للمربين والمعلمين حول هندسة الأوامر الذكية لبناء خطط دروس وأنشطة قيمية ملهمة.',
                'content' => 'يُعد التفاعل مع نماذج الذكاء الاصطناعي التوليدي مهارة جوهرية لكل مربٍ ومعلم في العصر الحديث. في هذا المقال نستعرض المبادئ الخمسة لهندسة الأوامر التربوية: تحديد الدور بدقة، توفير السياق التربوي والعمري، ضبط القيود والشروط، طلب صيغ مخرجات محددة، وتضمين أمثلة تطبيقية. إن استخدام قوالب الأوامر الدقيقة مثل منصة ترالي يمكّن المربي من الحصول على مخرجات عالية الجودة تختصر ساعات التخطيط والتحضير مع الحفاظ على الأصالة التربوية والقيمية.',
                'keywords' => ['هندسة الأوامر', 'الذكاء الاصطناعي في التعليم', 'التربية الحديثة', 'تصميم التعليم'],
                'image_url' => 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'category_slug' => 'curriculum-and-instructional-design',
                'title' => 'مصفوفة بناء القيم في المناهج التعليمية: من المعرفة إلى السلوك',
                'slug' => 'values-matrix-in-educational-curricula',
                'excerpt' => 'كيف ننتقل بالقيمة من مجرد مفهوم نظري يُحفظ إلى سلوك وممارسة يومية لدى المتعلمين؟',
                'content' => 'التعليم القيمي لا يقتصر على سرد النصوص والمعاني المجردة، بل يتطلب مساراً يبدأ من إثارة الاهتمام والوعي الوجداني، مروراً بالفهم والتحليل والمحاكاة، وصولاً إلى الممارسة الحية وحل المشكلات الواقعية. في هذا المقال نوضح نموذج ترالي لدمج القيم التربوية ضمن الأنشطة الصفية واللاصفية بأساليب التلعيب والتفكير الناقد.',
                'keywords' => ['بناء القيم', 'التصميم التعليمي', 'المناهج الدراسية', 'السلوك التربوي'],
                'image_url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'category_slug' => 'educational-environments-management',
                'title' => 'أركان البيئة التربوية الجاذبة: قواعد بناء المحضن التربوي الفعّال',
                'slug' => 'pillars-of-attractive-educational-environments',
                'excerpt' => 'عوامل الاستقرار والجاذبية في النوادي الشبابية والمحاضن التربوية وكيفية تفعيل دور المربي القدوة.',
                'content' => 'تقوم البيئة التربوية الناجحة على ثلاثة أركان رئيسية: الأمان النفسي والاحتواء الوجداني، البرامج التفاعلية التي تمنح مساحة للإبداع والقيادة، والقدوة الحية المتمثلة في الكادر الإشرافي المتفهم لخصائص المرحلة العمرية. نستعرض هنا استراتيجيات تنظيم اللقاءات الدورية وتوزيع المسؤوليات وتفعيل التواصل الإيجابي مع أسر المشاركين.',
                'keywords' => ['المحاضن التربوية', 'النوادي الشبابية', 'الإشراف التربوي', 'البيئة التعليمية'],
                'image_url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'category_slug' => 'initiatives-and-educational-innovation',
                'title' => 'دليل تصميم المبادرات التربوية من الفكرة إلى قياس الأثر',
                'slug' => 'educational-initiatives-design-guide',
                'excerpt' => 'خطوات بناء مبادرة تربوية قابلة للاستدامة مع نماذج لمؤشرات الأداء وتحليل المخاطر.',
                'content' => 'المبادرة التربوية الناجحة تنطلق دائماً من تشخيص حقيقي لاحتياج الميدان وليست مجرد أنشطة احتفالية عابرة. يتناول هذا الدليل كيفية صياغة وثيقة المبادرة، بناء خطة العمل التنفيذية، تحديد الميزانية المناسبة، ووضع مؤشرات كمية ونوعية تضمن استدامة الأثر الإيجابي.',
                'keywords' => ['مبادرات تربوية', 'الابتكار التعليمي', 'قياس الأثر', 'إدارة المشاريع'],
                'image_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($articles as $art) {
            $cat = $categories[$art['category_slug']];
            Article::updateOrCreate(
                ['slug' => $art['slug']],
                [
                    'category_id' => $cat->id,
                    'author_id' => $admin->id,
                    'title' => $art['title'],
                    'image_url' => $art['image_url'],
                    'excerpt' => $art['excerpt'],
                    'content' => $art['content'],
                    'keywords' => $art['keywords'],
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(1, 30)),
                ]
            );
        }

        // 4. Run MVP Generator Seeders
        $this->call([
            EducationalContentGeneratorSeeder::class,
            EducationalInitiativeGeneratorSeeder::class,
            EducationalNurturingEnvironmentGeneratorSeeder::class,
            AiOutputReviewGeneratorSeeder::class,
        ]);
    }
}
