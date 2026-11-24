/**
 * announcements.js — نافذة الإعلانات (إعلان نشط واحد فقط من جدول announcements)
 *
 * الاستخدام في صفحة الطلاب (index.html):
 *     <script src="js/announcements.js" data-auto></script>      ← يبدأ تلقائيًا بعد اكتمال تحميل الصفحة
 * الاستخدام من لوحة الإدارة للمعاينة (بلا بدء تلقائي):
 *     PlatformAnnouncements.show({ title, description, ... }, { preview: true });
 *
 * السلوك:
 *   - يجلب الإعلان النشط فقط وبأعمدة محددة (استعلام خفيف) بعد حدث load، وفي وقت الخمول إن أمكن؛
 *     فلا يؤخّر تحميل الصفحة ولا يظهر قبل اكتمالها.
 *   - إغلاق النافذة يحفظ رقم الإعلان في sessionStorage (لجلسة التصفح الحالية فقط): لا يظهر مجددًا في الجلسة،
 *     ويظهر في جلسة جديدة. لا يُعطَّل شيء في قاعدة البيانات.
 *   - أي فشل (اتصال/جدول غير موجود/RLS) يُتجاهل بصمت: لا نافذة ولا أثر على بقية المنصة.
 *   - الأمان: كل نص يُعرض بـ textContent (لا innerHTML إطلاقًا)، والروابط (الصورة والزر) تُقبل http/https فقط.
 *   - لا يستدعي supabase.createClient(): يستعمل عميل المنصة الوحيد PlatformAuth.getClient().
 */
(function () {
    'use strict';

    if (window.PlatformAnnouncements) return;

    var SCRIPT = document.currentScript;
    var DISMISS_KEY = 'agri_announcement_dismissed';   // لا يبدأ بـ agri_user_ عمدًا: لا يُمسح عند تسجيل الخروج
    var COLUMNS = 'id,title,description,image_url,button_text,button_url,copy_text,announcement_type';
    var FETCH_TIMEOUT = 8000;

    var TYPES = {
        info:      { label: 'إعلان',       icon: 'news' },
        important: { label: 'تنبيه مهم',   icon: 'alert' },
        support:   { label: 'دعم المنصة',  icon: 'heart' }
    };

    var stack = [];          // النوافذ المفتوحة (الأعلى = الأخيرة)
    var lockCount = 0;
    var seq = 0;
    var started = false;
    var memoryDismissed = '';

    /* =========================================
       أدوات صغيرة
    ========================================= */
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined && text !== null) n.textContent = text;
        return n;
    }

    function icon(name) {
        var i = el('i', 'ic ic-' + name);
        i.setAttribute('aria-hidden', 'true');
        return i;
    }

    function reduceMotion() {
        try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
        catch (e) { return false; }
    }

    /** رابط http/https صالح فقط (يمنع javascript: و data: وغيرها) وإلا نص فارغ */
    function safeUrl(value) {
        if (typeof value !== 'string') return '';
        var v = value.trim();
        if (!v || v.length > 2000) return '';
        try {
            var u = new URL(v);
            return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
        } catch (e) {
            return '';
        }
    }

    function clean(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    /** يحوّل صف قاعدة البيانات/النموذج إلى بيانات عرض آمنة، أو null إن لم يصلح للعرض */
    function normalize(data) {
        if (!data || typeof data !== 'object') return null;

        var title = clean(data.title);
        var description = clean(data.description);
        if (!title && !description) return null;

        var type = TYPES[data.announcement_type] ? data.announcement_type : 'info';
        var buttonText = clean(data.button_text);
        var buttonHref = safeUrl(data.button_url);
        var copyText = clean(data.copy_text);

        return {
            type: type,
            title: title,
            description: description,
            image: safeUrl(data.image_url),
            // copy_text: نص يُنسخ كما هو (لا trim على المحتوى الداخلي)، وله الأولوية على الرابط
            copy: copyText ? { text: buttonText || 'نسخ', value: copyText } : null,
            button: (!copyText && buttonText && buttonHref) ? { text: buttonText, href: buttonHref } : null
        };
    }

    /** نسخ نص إلى الحافظة: Clipboard API ثم بديل execCommand للمتصفحات/السياقات غير الآمنة. Promise<boolean> */
    function copyToClipboard(text) {
        function fallback() {
            try {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
                document.body.appendChild(ta);
                ta.select();
                var ok = document.execCommand('copy');
                document.body.removeChild(ta);
                return ok;
            } catch (e) { return false; }
        }
        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
            }
        } catch (e) { /* ننتقل للبديل */ }
        return Promise.resolve(fallback());
    }

    /* =========================================
       قفل التمرير + لوحة المفاتيح (Esc / Tab)
    ========================================= */
    function lock() {
        lockCount += 1;
        document.documentElement.classList.add('ann-lock');
    }

    function unlock() {
        lockCount = Math.max(0, lockCount - 1);
        if (!lockCount) document.documentElement.classList.remove('ann-lock');
    }

    /* مستمع على window (مرحلة الالتقاط) حتى يسبق مستمعات document: Esc في المعاينة داخل لوحة الإدارة
       يغلق المعاينة وحدها، ولا يغلق نافذة النموذج التي تحتها. */
    function onKey(e) {
        var top = stack[stack.length - 1];
        if (!top) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            top.close('escape');
            return;
        }

        if (e.key === 'Tab') {
            e.stopPropagation();
            var items = top.dialog.querySelectorAll('a[href], button:not([disabled])');
            if (!items.length) { e.preventDefault(); top.dialog.focus(); return; }

            var first = items[0];
            var last = items[items.length - 1];
            var active = document.activeElement;
            var inside = top.dialog.contains(active) && active !== top.dialog;

            if (!inside) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
            else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
        }
    }

    /* =========================================
       بناء النافذة وعرضها
       opts: { preview: boolean, onClose: function(reason) }
    ========================================= */
    function show(data, opts) {
        opts = opts || {};
        var d = normalize(data);
        if (!d) return null;

        var previous = document.activeElement;
        var uid = 'annDlg' + (++seq);
        var meta = TYPES[d.type];

        var overlay = el('div', 'ann-overlay');
        var dialog = el('div', 'ann-dialog ann-dialog--' + d.type);
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('tabindex', '-1');
        if (d.title) dialog.setAttribute('aria-labelledby', uid + 'T');
        if (d.description) dialog.setAttribute('aria-describedby', uid + 'D');

        var closeBtn = el('button', 'ann-close');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'إغلاق');
        closeBtn.appendChild(icon('x'));
        dialog.appendChild(closeBtn);

        if (opts.preview) dialog.appendChild(el('p', 'ann-preview-tag', 'معاينة — هكذا سيراه الطلاب'));

        var scroll = el('div', 'ann-scroll');

        if (d.image) {
            var media = el('div', 'ann-media');
            var img = document.createElement('img');
            img.alt = '';
            img.decoding = 'async';
            img.referrerPolicy = 'no-referrer';
            img.addEventListener('error', function () { if (media.parentNode) media.parentNode.removeChild(media); });
            img.src = d.image;
            media.appendChild(img);
            scroll.appendChild(media);
        }

        var body = el('div', 'ann-body');
        var badge = el('span', 'ann-badge');
        badge.appendChild(icon(meta.icon));
        badge.appendChild(document.createTextNode(meta.label));
        body.appendChild(badge);

        if (d.title) {
            var h = el('h2', 'ann-title', d.title);
            h.id = uid + 'T';
            body.appendChild(h);
        }
        if (d.description) {
            var p = el('p', 'ann-text', d.description);
            p.id = uid + 'D';
            body.appendChild(p);
        }

        var footer = el('div', 'ann-footer');      // خارج منطقة التمرير: الأزرار تبقى ظاهرة مع النص الطويل
        var actions = el('div', 'ann-actions');
        var status = el('p', 'ann-copy-status');   // رسالة نجاح/فشل النسخ (aria-live)
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.hidden = true;

        if (d.copy) {
            var copyBtn = el('button', 'ann-btn ann-btn--primary');
            copyBtn.type = 'button';
            copyBtn.appendChild(document.createTextNode(d.copy.text));
            copyBtn.appendChild(icon('copy'));
            copyBtn.addEventListener('click', function () {
                copyToClipboard(d.copy.value).then(function (ok) {
                    status.hidden = false;
                    status.className = 'ann-copy-status ' + (ok ? 'is-ok' : 'is-error');
                    status.textContent = ok ? 'تم النسخ بنجاح' : 'تعذّر النسخ، يرجى نسخ النص يدويًا';
                });
            });
            actions.appendChild(copyBtn);
        } else if (d.button) {
            var cta = el('a', 'ann-btn ann-btn--primary');
            cta.href = d.button.href;
            cta.target = '_blank';
            cta.rel = 'noopener noreferrer';
            cta.appendChild(document.createTextNode(d.button.text));
            cta.appendChild(icon('external'));
            actions.appendChild(cta);
        }
        var dismiss = el('button', 'ann-btn ann-btn--ghost', 'إغلاق');
        dismiss.type = 'button';
        actions.appendChild(dismiss);
        footer.appendChild(actions);
        footer.appendChild(status);

        scroll.appendChild(body);
        dialog.appendChild(scroll);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);

        var closed = false;
        var handle = { dialog: dialog, close: close };

        function close(reason) {
            if (closed) return;
            closed = true;

            var i = stack.indexOf(handle);
            if (i !== -1) stack.splice(i, 1);
            if (!stack.length) window.removeEventListener('keydown', onKey, true);

            overlay.classList.remove('is-open');
            unlock();

            function remove() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
            if (reduceMotion()) remove(); else setTimeout(remove, 280);

            try { if (previous && previous.focus && document.contains(previous)) previous.focus(); } catch (e) { /* لا شيء */ }
            if (typeof opts.onClose === 'function') opts.onClose(reason || 'close');
        }

        closeBtn.addEventListener('click', function () { close('button'); });
        dismiss.addEventListener('click', function () { close('button'); });
        overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close('backdrop'); });

        if (!stack.length) window.addEventListener('keydown', onKey, true);
        stack.push(handle);
        lock();

        document.body.appendChild(overlay);
        void overlay.offsetWidth;                 // يثبّت الحالة الابتدائية ليعمل الانتقال
        overlay.classList.add('is-open');
        try { dialog.focus({ preventScroll: true }); } catch (e) { dialog.focus(); }

        return { close: close, element: overlay };
    }

    /* =========================================
       جلب الإعلان النشط (آمن: لا يرمي أبدًا)
    ========================================= */
    function withTimeout(promise, ms) {
        return new Promise(function (resolve, reject) {
            var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
            promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
        });
    }

    function fetchActive() {
        try {
            var client = window.PlatformAuth && window.PlatformAuth.getClient && window.PlatformAuth.getClient();
            if (!client || window.SUPABASE_CONFIG_ERROR) return Promise.resolve(null);

            var query = client.from('announcements')
                .select(COLUMNS)
                .eq('is_active', true)
                .limit(1)
                .maybeSingle();

            return withTimeout(Promise.resolve(query), FETCH_TIMEOUT).then(function (res) {
                if (!res || res.error || !res.data) {
                    if (res && res.error) console.warn('[announcements] تعذر جلب الإعلان:', res.error.message || res.error);
                    return null;
                }
                return res.data;
            }).catch(function (e) {
                console.warn('[announcements] تعذر جلب الإعلان:', e && e.message ? e.message : e);
                return null;
            });
        } catch (e) {
            return Promise.resolve(null);
        }
    }

    /* =========================================
       جلسة التصفح: تذكّر الإغلاق
    ========================================= */
    function readDismissed() {
        try { return window.sessionStorage.getItem(DISMISS_KEY) || memoryDismissed; }
        catch (e) { return memoryDismissed; }
    }

    function writeDismissed(id) {
        memoryDismissed = String(id);
        try { window.sessionStorage.setItem(DISMISS_KEY, memoryDismissed); } catch (e) { /* التخزين محجوب: نكتفي بالذاكرة */ }
    }

    /* =========================================
       البدء: بعد اكتمال تحميل الصفحة (حدث load) ثم وقت الخمول
    ========================================= */
    function run() {
        fetchActive().then(function (row) {
            if (!row || row.id === undefined || row.id === null) return;
            if (readDismissed() === String(row.id)) return;

            show(row, { onClose: function () { writeDismissed(row.id); } });
        }).catch(function () { /* الإعلان لا يجوز أن يكسر الصفحة */ });
    }

    function init() {
        if (started) return;
        started = true;

        function schedule() {
            if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 2500 });
            else setTimeout(run, 800);
        }

        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
    }

    window.PlatformAnnouncements = {
        init: init,
        show: show,
        fetchActive: fetchActive,
        types: TYPES
    };

    if (SCRIPT && SCRIPT.hasAttribute('data-auto')) init();
})();
