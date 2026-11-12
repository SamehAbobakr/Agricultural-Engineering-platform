-- =====================================================================
-- اختبار نظام الإعلانات (على Staging فقط). يعمل داخل Transaction وينتهي بـ ROLLBACK فلا يترك أثرًا.
-- شغّل الملف كاملًا في SQL Editor؛ كل فحص يطبع NOTICE بـ PASS أو يرفع خطأ FAIL.
-- يحتاج: 001_announcements.sql مُنفَّذًا. (الجدول يجب أن يكون بلا إعلان نشط، وإلا يُعطَّل داخل الاختبار ثم يُسترجع بالـ ROLLBACK.)
-- ملاحظة: اختبارات الأدوار (anon / مستخدم عادي) تُشغَّل بـ SET LOCAL ROLE؛ الاختبار الأخير للمسؤول يتطلب
--         بريد مسؤول مؤكَّد (admin_emails) وإلا يُتخطّى مع NOTICE.
-- =====================================================================
BEGIN;

DO $$
DECLARE
    a UUID; b UUID; c UUID; n INT; ok BOOLEAN;
BEGIN
    -- 1) إدراج إعلان نشط
    INSERT INTO public.announcements (title, description, is_active) VALUES ('A', 'نص A', TRUE) RETURNING id INTO a;
    IF (SELECT COUNT(*) FROM public.announcements WHERE is_active) <> 1 THEN RAISE EXCEPTION 'FAIL 1: one active expected'; END IF;
    RAISE NOTICE 'PASS 1: insert active';

    -- 2) إدراج إعلان نشط ثانٍ يعطّل الأول تلقائيًا (دون حذفه)
    INSERT INTO public.announcements (title, description, is_active) VALUES ('B', 'نص B', TRUE) RETURNING id INTO b;
    IF (SELECT is_active FROM public.announcements WHERE id = a) THEN RAISE EXCEPTION 'FAIL 2: A must be deactivated'; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.announcements WHERE id = a) THEN RAISE EXCEPTION 'FAIL 2: A must NOT be deleted'; END IF;
    IF (SELECT COUNT(*) FROM public.announcements WHERE is_active) <> 1 THEN RAISE EXCEPTION 'FAIL 2: exactly one active'; END IF;
    RAISE NOTICE 'PASS 2: new active replaces old, old kept';

    -- 3) تفعيل القديم عبر UPDATE يعطّل الجديد
    UPDATE public.announcements SET is_active = TRUE WHERE id = a;
    IF NOT (SELECT is_active FROM public.announcements WHERE id = a) OR (SELECT is_active FROM public.announcements WHERE id = b) THEN
        RAISE EXCEPTION 'FAIL 3: activation by update must swap'; END IF;
    RAISE NOTICE 'PASS 3: activate via update swaps';

    -- 4) تعطيل الكل مسموح (لا إعلان نشط)
    UPDATE public.announcements SET is_active = FALSE WHERE id = a;
    IF (SELECT COUNT(*) FROM public.announcements WHERE is_active) <> 0 THEN RAISE EXCEPTION 'FAIL 4: zero active allowed'; END IF;
    RAISE NOTICE 'PASS 4: deactivate leaves none active';

    -- 5) تعديل إعلان نشط لا يعطّل نفسه ويحدّث updated_at
    UPDATE public.announcements SET is_active = TRUE, created_at = NOW() - INTERVAL '1 day' WHERE id = b;
    UPDATE public.announcements SET title = 'B2' WHERE id = b;   -- NOW() ثابتة داخل المعاملة، لذا نُرجِع created_at يومًا للخلف
    IF NOT (SELECT is_active FROM public.announcements WHERE id = b) THEN RAISE EXCEPTION 'FAIL 5: editing active must keep it active'; END IF;
    IF (SELECT updated_at FROM public.announcements WHERE id = b) <= (SELECT created_at FROM public.announcements WHERE id = b) THEN
        RAISE EXCEPTION 'FAIL 5: updated_at must move'; END IF;
    RAISE NOTICE 'PASS 5: edit active keeps active + updated_at';

    -- 6) القيود
    ok := FALSE; BEGIN INSERT INTO public.announcements (title, description, announcement_type) VALUES ('x', 'y', 'bad'); EXCEPTION WHEN check_violation THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 6a: invalid type must be rejected'; END IF;
    ok := FALSE; BEGIN INSERT INTO public.announcements (title, description, button_text, button_url) VALUES ('x', 'y', 'زر', 'javascript:alert(1)'); EXCEPTION WHEN check_violation THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 6b: javascript: url must be rejected'; END IF;
    ok := FALSE; BEGIN INSERT INTO public.announcements (title, description, button_text) VALUES ('x', 'y', 'زر بلا رابط'); EXCEPTION WHEN check_violation THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 6c: button text without url must be rejected'; END IF;
    ok := FALSE; BEGIN INSERT INTO public.announcements (title, description, image_url) VALUES ('x', 'y', 'data:text/html,<script>'); EXCEPTION WHEN check_violation THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 6d: non-http image must be rejected'; END IF;
    ok := FALSE; BEGIN INSERT INTO public.announcements (title, description) VALUES ('   ', 'y'); EXCEPTION WHEN check_violation THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 6e: blank title must be rejected'; END IF;
    RAISE NOTICE 'PASS 6: constraints';

    -- 7) إعلان بلا صورة وبلا زر مقبول، وبزر كامل مقبول
    INSERT INTO public.announcements (title, description) VALUES ('بدون صورة/زر', 'نص') RETURNING id INTO c;
    INSERT INTO public.announcements (title, description, image_url, button_text, button_url)
    VALUES ('كامل', 'نص', 'https://example.com/a.png', 'اعرف المزيد', 'https://example.com/x');
    RAISE NOTICE 'PASS 7: optional image/button';

    -- 8) الفهرس الفريد يمنع نشطين حتى لو عُطّل الـ trigger (طبقة الحماية الثانية)
    ALTER TABLE public.announcements DISABLE TRIGGER announcements_before_write;
    UPDATE public.announcements SET is_active = FALSE;
    UPDATE public.announcements SET is_active = TRUE WHERE id = b;
    ok := FALSE;
    BEGIN UPDATE public.announcements SET is_active = TRUE WHERE id = c; EXCEPTION WHEN unique_violation THEN ok := TRUE; END;
    ALTER TABLE public.announcements ENABLE TRIGGER announcements_before_write;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 8: unique partial index must block two active'; END IF;
    RAISE NOTICE 'PASS 8: unique partial index';

    UPDATE public.announcements SET is_active = FALSE;
    UPDATE public.announcements SET is_active = TRUE WHERE id = b;
END
$$;

-- 9) الزائر (anon): يرى النشط فقط ولا يكتب
SET LOCAL ROLE anon;
DO $$
DECLARE n INT; ok BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO n FROM public.announcements;
    IF n <> 1 THEN RAISE EXCEPTION 'FAIL 9a: anon must see exactly the active one, saw %', n; END IF;
    IF EXISTS (SELECT 1 FROM public.announcements WHERE NOT is_active) THEN RAISE EXCEPTION 'FAIL 9a: anon sees inactive'; END IF;
    ok := FALSE;
    BEGIN INSERT INTO public.announcements (title, description) VALUES ('hack', 'x'); EXCEPTION WHEN insufficient_privilege THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 9b: anon insert must be denied'; END IF;
    ok := FALSE;
    BEGIN UPDATE public.announcements SET is_active = FALSE; EXCEPTION WHEN insufficient_privilege THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 9c: anon update must be denied'; END IF;
    RAISE NOTICE 'PASS 9: anon read-active-only, no writes';
END
$$;
RESET ROLE;

-- 10) مستخدم مسجَّل غير مسؤول: يرى النشط فقط، والكتابة لا تغيّر شيئًا (RLS) أو تُرفض
--     (يحاكي JWT لمستخدم عشوائي ليس في admin_emails)
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', TRUE);
SET LOCAL ROLE authenticated;
DO $$
DECLARE n INT; ok BOOLEAN;
BEGIN
    IF (SELECT COUNT(*) FROM public.announcements) <> 1 THEN RAISE EXCEPTION 'FAIL 10a: non-admin must see only the active one'; END IF;
    ok := FALSE;
    BEGIN INSERT INTO public.announcements (title, description) VALUES ('hack', 'x'); EXCEPTION WHEN insufficient_privilege THEN ok := TRUE; END;
    IF NOT ok THEN RAISE EXCEPTION 'FAIL 10b: non-admin insert must be denied by RLS'; END IF;
    UPDATE public.announcements SET title = 'hacked';
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n <> 0 THEN RAISE EXCEPTION 'FAIL 10c: non-admin update must affect 0 rows, affected %', n; END IF;
    DELETE FROM public.announcements;
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n <> 0 THEN RAISE EXCEPTION 'FAIL 10d: non-admin delete must affect 0 rows'; END IF;
    RAISE NOTICE 'PASS 10: authenticated non-admin cannot write';
END
$$;
RESET ROLE;

ROLLBACK;
