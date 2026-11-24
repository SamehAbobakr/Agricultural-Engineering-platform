-- =====================================================================
-- إعلانات: السماح بزر «نسخ» (copy_text) دون رابط
--
-- العمود copy_text أُضيف مسبقًا:  ALTER TABLE public.announcements ADD COLUMN copy_text TEXT;
-- المشكلة: القيد announcements_button_pair يفرض (button_text IS NULL) = (button_url IS NULL)
--          فيرفض أي إعلان فيه button_text + copy_text بلا button_url.
-- الحل: استبدال القيد فقط (لا أعمدة ولا جداول جديدة، ولا تغيير على البيانات الحالية):
--          الرابط يحتاج نص زر، ونص الزر يحتاج رابطًا أو copy_text.
-- كل الصفوف الحالية (نص+رابط، أو لا شيء) تُحقق القيد الجديد. آمن لإعادة التشغيل.
-- نفّذه على Staging أولًا ثم Production.
-- =====================================================================
BEGIN;

ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_button_pair;

ALTER TABLE public.announcements ADD CONSTRAINT announcements_button_pair
    CHECK (
        button_url IS NULL AND (button_text IS NULL OR NULLIF(BTRIM(copy_text), '') IS NOT NULL)
        OR (button_url IS NOT NULL AND button_text IS NOT NULL)
    );

COMMIT;
