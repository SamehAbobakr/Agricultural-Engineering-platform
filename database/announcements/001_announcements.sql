-- =====================================================================
-- نظام الإعلانات: جدول announcements + إعلان نشط واحد فقط + RLS
--
-- أين يُنفَّذ؟  Supabase → SQL Editor → الصق الملف كاملًا → Run (آمن لإعادة التشغيل، لا يحذف بيانات).
-- المتطلب السابق: database/admin/001_admin_setup.sql (يوفّر الدالة public.is_admin()).
-- نفّذه على Staging أولًا ثم Production.
--
-- قرارات التصميم:
--   * «إعلان نشط واحد فقط» تضمنه قاعدة البيانات نفسها بطبقتين:
--       (1) فهرس فريد جزئي على is_active حيث is_active = TRUE → يستحيل وجود نشطين معًا مهما كان العميل.
--       (2) trigger قبل الكتابة: عند تفعيل إعلان يُعطَّل النشط السابق تلقائيًا (UPDATE فقط، لا حذف أبدًا)،
--           مع advisory lock حتى لا يتعارض تفعيلان متزامنان. الصف القديم يبقى محفوظًا بحالة «غير نشط».
--   * القراءة العامة (anon + authenticated) للإعلان النشط فقط، والكتابة والقراءة الكاملة للمسؤول (is_admin()).
--   * لا يمسّ هذا الملف أي جدول أو سياسة موجودة؛ الدالة public.is_admin() تُستخدم كما هي.
--   * نص الإعلان نص عادي (لا HTML)؛ الواجهة تعرضه بـ textContent، والروابط مقيّدة بـ http/https في القيود أيضًا.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.announcements (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             TEXT        NOT NULL,
    description       TEXT        NOT NULL,
    image_url         TEXT,
    button_text       TEXT,
    button_url        TEXT,
    announcement_type TEXT        NOT NULL DEFAULT 'info',
    is_active         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT announcements_title_len       CHECK (CHAR_LENGTH(BTRIM(title)) BETWEEN 1 AND 150),
    CONSTRAINT announcements_description_len CHECK (CHAR_LENGTH(BTRIM(description)) BETWEEN 1 AND 2000),
    CONSTRAINT announcements_type_valid      CHECK (announcement_type IN ('info', 'important', 'support')),
    CONSTRAINT announcements_image_http      CHECK (image_url IS NULL
                                                    OR (CHAR_LENGTH(image_url) <= 2000 AND image_url ~* '^https?://[^[:space:]]+$')),
    CONSTRAINT announcements_button_text_len CHECK (button_text IS NULL OR CHAR_LENGTH(BTRIM(button_text)) BETWEEN 1 AND 40),
    CONSTRAINT announcements_button_http     CHECK (button_url IS NULL
                                                    OR (CHAR_LENGTH(button_url) <= 2000 AND button_url ~* '^https?://[^[:space:]]+$')),
    -- الزر إمّا كامل (نص + رابط) أو غير موجود
    CONSTRAINT announcements_button_pair     CHECK ((button_text IS NULL) = (button_url IS NULL))
);

COMMENT ON TABLE public.announcements IS
    'إعلانات المنصة. إعلان نشط واحد فقط (فهرس فريد جزئي + trigger). القراءة العامة للنشط فقط، والكتابة للمسؤول (is_admin()).';

-- ---------------------------------------------------------------------
-- الفهارس
-- ---------------------------------------------------------------------
-- (1) يضمن وجود إعلان نشط واحد على الأكثر، ويخدم أيضًا استعلام «الإعلان النشط» للطلاب (فهرس صغير جدًا)
CREATE UNIQUE INDEX IF NOT EXISTS announcements_one_active_idx
    ON public.announcements (is_active) WHERE is_active;

-- (2) ترتيب القائمة في لوحة الإدارة (الأحدث أولًا)
CREATE INDEX IF NOT EXISTS announcements_created_at_idx
    ON public.announcements (created_at DESC);

-- ---------------------------------------------------------------------
-- trigger: updated_at + تعطيل الإعلان النشط السابق عند تفعيل إعلان جديد
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.announcements_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := NOW();

    IF NEW.is_active THEN
        -- يمنع تعارض تفعيلين متزامنين (يُرفع القفل تلقائيًا بنهاية المعاملة)
        PERFORM pg_advisory_xact_lock(HASHTEXT('public.announcements.active'));

        -- تعطيل (لا حذف) أي إعلان نشط آخر؛ هذا التحديث يمرّ عبر trigger نفسه لكن بـ is_active = FALSE فلا يتكرر
        UPDATE public.announcements
           SET is_active = FALSE
         WHERE is_active AND id <> NEW.id;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS announcements_before_write ON public.announcements;
CREATE TRIGGER announcements_before_write
    BEFORE INSERT OR UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.announcements_before_write();

-- ---------------------------------------------------------------------
-- RLS: قراءة عامة للنشط فقط، وكل شيء آخر للمسؤول
-- ---------------------------------------------------------------------
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_public_read" ON public.announcements;
CREATE POLICY "announcements_public_read"
    ON public.announcements FOR SELECT TO anon, authenticated
    USING (is_active);

DROP POLICY IF EXISTS "admin_all" ON public.announcements;
CREATE POLICY "admin_all"
    ON public.announcements FOR ALL TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

-- الصلاحيات (طبقة ثانية فوق RLS): الزائر قراءة فقط، والكتابة محكومة بسياسة admin_all
REVOKE ALL ON TABLE public.announcements FROM anon, authenticated;
GRANT SELECT ON TABLE public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.announcements TO authenticated;

COMMIT;

-- للتحقق بعد التشغيل (اختياري):
--   SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'announcements';
--     → announcements_public_read {anon,authenticated} SELECT  و  admin_all {authenticated} ALL
--   SELECT rowsecurity FROM pg_tables WHERE tablename = 'announcements';   → true
--   SELECT indexdef FROM pg_indexes WHERE indexname = 'announcements_one_active_idx';
