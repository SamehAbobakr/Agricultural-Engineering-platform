// =========================================
// عميل Supabase (واحد لكل صفحة)
// يُنشأ في js/auth.js — لا تستدعِ supabase.createClient() هنا ولا في أي ملف آخر
// =========================================

const supabaseClient = PlatformAuth.getClient();


// =========================================
// Cache للبيانات العامة (المواد / الملفات / إحصائيات الرئيسية)
//
// لماذا؟ كانت كل دالة عرض تعيد جلب نفس البيانات من Supabase في كل مرة:
//   - الرجوع للرئيسية يعيد 3 طلبات إحصائيات،
//   - كل ضغطة على تبويب داخل المادة تعيد جلب كل ملفات المادة،
//   - فتح نفس قائمة المواد أو نفس المادة مرة ثانية يعيد الطلب.
//
// كيف يعمل؟
//   - الـ Cache في ذاكرة الصفحة المفتوحة فقط (لا localStorage ولا sessionStorage):
//     أي تحميل أو تحديث للصفحة يجلب بيانات جديدة من Supabase.
//   - لو طُلبت نفس البيانات والطلب الأول ما زال جاريًا، يُنتظر نفس الطلب ولا يُرسل طلب ثانٍ.
//   - أقصى عمر للبيانات داخل الصفحة المفتوحة: CACHE_TTL_MS، ثم تُجلب من جديد.
//   - الطلب الفاشل لا يُخزَّن أبدًا، فيُعاد فعليًا في المرة التالية.
//   - لوحة الإدارة تكتب المفتاح CACHE_VERSION_KEY في localStorage بعد أي إضافة/تعديل/حذف
//     لمادة أو ملف (admin/js/core/data.js)، فتمسح كل صفحات المنصة المفتوحة في نفس المتصفح
//     الـ Cache فورًا عبر حدث storage. (لا يوجد عندنا وسيلة لإبلاغ متصفحات الطلاب الآخرين؛
//     هؤلاء يرون التحديث بعد انتهاء CACHE_TTL_MS أو عند تحديث الصفحة.)
//   - لا يُخزَّن هنا أي بيانات مستخدم: المواد والملفات والإحصائيات بيانات عامة فقط.
// =========================================

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_VERSION_KEY = 'agri_public_data_version';

const PublicDataCache = (function () {
    'use strict';

    const entries = new Map();   // المفتاح → { promise, expires }

    function get(key, loader) {
        const hit = entries.get(key);

        if (hit && hit.expires > Date.now()) {
            return hit.promise;
        }

        const entry = {
            promise: Promise.resolve().then(loader),
            expires: Date.now() + CACHE_TTL_MS
        };

        entries.set(key, entry);

        // الفشل لا يُخزَّن: نحذف المدخل ليُرسل الطلب فعليًا في المحاولة التالية
        entry.promise.catch(function () {
            if (entries.get(key) === entry) entries.delete(key);
        });

        return entry.promise;
    }

    function clear() {
        entries.clear();
    }

    // لوحة الإدارة (في تبويب آخر بنفس المتصفح) غيّرت مادة أو ملفًا
    window.addEventListener('storage', function (event) {
        if (event.key === CACHE_VERSION_KEY) clear();
    });

    return { get: get, clear: clear };
})();


// =========================================
// جلب المواد الدراسية حسب المسار الحالي
// (البرنامج / الفرقة / الترم / القسم)
// =========================================

async function loadSubjectsFromSupabase() {
    try {
        const program = currentProgram.trim();
        const grade = currentGrade.trim();
        const term = currentTerm.trim();
        const dept = currentDept.trim();

        return await PublicDataCache.get(
            'subjects:' + JSON.stringify([program, grade, term, dept]),
            async () => {
                const { data, error } = await supabaseClient
                    .from('subjects')
                    .select('*')
                    .ilike('program', `%${program}%`)
                    .ilike('grade', `%${grade}%`)
                    .ilike('term', `%${term}%`)
                    .ilike('department', `%${dept}%`)
                    .limit(30);

                if (error) throw error;

                return data || [];
            }
        );

    } catch (error) {
        console.error("❌ خطأ في جلب المواد من Supabase:", error);
        return [];
    }
}


// =========================================
// جلب كل ملفات مادة واحدة (طلب واحد لكل مادة)
// منه تُستخرج التبويبات (الأقسام) ومنه تُعرض ملفات كل تبويب،
// فالتنقل بين التبويبات لا يرسل أي طلب جديد.
// يرمي الخطأ عند الفشل ليعرض المستدعي رسالة الخطأ كما كان.
// =========================================

function loadSubjectFiles(subjectId) {
    return PublicDataCache.get(
        'files:' + subjectId,
        async () => {
            const { data, error } = await supabaseClient
                .from('material_files')
                .select('*')
                .eq('subject_id', subjectId)
                .order('file_order', { ascending: true });

            if (error) throw error;

            return data || [];
        }
    );
}


// =========================================
// إحصائيات الصفحة الرئيسية (عدد المواد / الملفات / أعضاء هيئة التدريس)
// طلبان بدل ثلاثة: جلب عمود professor يرجع معه العدد الدقيق للمواد
// (Content-Range) فلا حاجة لطلب HEAD منفصل على جدول المواد.
// يرمي الخطأ عند الفشل ليعرض المستدعي «—» كما كان.
// =========================================

function loadHomeStats() {
    return PublicDataCache.get(
        'home-stats',
        async () => {
            const [subjectsRes, filesRes] = await Promise.all([
                supabaseClient
                    .from('subjects')
                    .select('professor', { count: 'exact' }),
                supabaseClient
                    .from('material_files')
                    .select('*', { count: 'exact', head: true })
            ]);

            if (subjectsRes.error) throw subjectsRes.error;
            if (filesRes.error) throw filesRes.error;

            // حذف القيم الفارغة والتكرارات
            const uniqueProfessors = new Set(
                (subjectsRes.data || [])
                    .map(item => item.professor)
                    .filter(name => name && name.trim() !== '')
            );

            return {
                subjectsCount: subjectsRes.count || 0,
                filesCount: filesRes.count || 0,
                professorsCount: uniqueProfessors.size
            };
        }
    );
}
