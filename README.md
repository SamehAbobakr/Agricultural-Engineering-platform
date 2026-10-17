# منصة كلية الهندسة الزراعية – جامعة الأزهر

موقع تعليمي مجاني (عربي RTL) يعرض مقررات ومحاضرات وملفات الكلية. مكتوب بـ HTML وCSS وJavaScript عادي بدون أدوات بناء، ومنشور على GitHub Pages، والبيانات من Supabase والملفات على Cloudflare R2.

## هيكل المشروع

| المسار | وظيفته |
|---|---|
| `index.html` | الصفحة الرئيسية (التطبيق كله يُرسم داخل `#contentArea` بواسطة JS) |
| `about/about.html` | صفحة "عن الكلية" (مستقلة) |
| `tools/tools.html` | صفحة الأدوات، و`tools/study-timer.html` مؤقت المذاكرة (مستقل) |
| `student_dashboard/` | لوحة إنجاز الطالب (`index.html` + `css/style.css` + `js/app.js`) |
| `css/` | تنسيقات مشتركة بين كل الصفحات (`variables.css` فيه الألوان والوضع الليلي/النهاري) |
| `js/` | سكربتات الصفحة الرئيسية |
| `assets/images/icons/` | صور الأيقونات |
| `.github/workflows/supabase-keepalive.yml` | يرسل طلبًا لـ Supabase كل 3 أيام حتى لا يتوقف المشروع المجاني |

## ترتيب سكربتات الصفحة الرئيسية (مهم)

`config.js` ← `state.js` ← `data.js` ← `supabase.js` ← `ui.js` ← `navigation.js` ← `departments.js` ← `home.js` ← `subjects.js` ← `materials.js` ← `search.js` ← `ai-assistant.js` ← `app.js`

كل ملف يعتمد على ما قبله، فلا تغيّر الترتيب في `index.html`.

## قواعد أمان عند تعديل الكود

1. **أي نص قادم من قاعدة البيانات** يمرّ على `escapeHtml(...)` قبل وضعه في HTML.
2. **أي رابط قادم من قاعدة البيانات** يمرّ على `safeUrl(...)` (يقبل `http` و`https` فقط).
3. **لا تكتب بيانات داخل `onclick="..."` مباشرة.** استخدم `inlineArg(قيمة)` الموجودة في `js/ui.js`، فهي تمرّر رقمًا فقط وتمنع حقن الكود.
4. مفتاح Supabase الموجود في `js/config.js` مفتاح **عام** (`publishable`) ومصمَّم للواجهة، وحمايته الحقيقية تكون بسياسات Row Level Security في Supabase. لا تضع أبدًا مفتاح `service_role` أو أي مفتاح سري في هذا المستودع.

## الروابط بين الصفحات

الموقع منشور على مسار فرعي (`/Agricultural-Engineering-platform/`)، لذلك استخدم مسارات **نسبية** فقط:
من `index.html` اكتب `tools/tools.html`، ومن داخل مجلد فرعي اكتب `../index.html`. لا تبدأ أي رابط بـ `/`.

## لوحة الإنجاز: تعديل التصميم

ملف `student_dashboard/css/tailwind.css` ناتج بناء Tailwind (مرفوع جاهزًا). إذا أضفت أصناف Tailwind جديدة داخل `student_dashboard/index.html` أو `student_dashboard/js/*.js` فشغّل داخل مجلد `student_dashboard`:

```
npm install
npm run build:css
```
