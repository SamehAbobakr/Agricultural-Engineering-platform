"""
اختبارات واجهة نظام الإعلانات (Playwright + Supabase وهمي في الذاكرة).
تشغيل:  python3 tests-report/announcements/run_tests.py
ملاحظة: هذه اختبارات للواجهة وسلوكها مع محاكاة RLS والـ trigger؛ SQL الحقيقي يُختبر بـ database/announcements/tests/announcements_tests.sql على Staging.
"""
import json, sys, threading, http.server, socketserver, os, functools
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SHOTS = os.path.join(HERE, 'screenshots')
PORT = 8793

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORT}'
STUB = open(os.path.join(HERE, 'stub.js'), encoding='utf-8').read()

results = []
def check(name, cond, extra=''):
    results.append({'name': name, 'pass': bool(cond), 'extra': str(extra)})
    print(('PASS ' if cond else 'FAIL ') + name + (f'  [{extra}]' if (extra and not cond) else ''))

def row(i, **kw):
    r = dict(id=f'a{i}', title=f'إعلان {i}', description=f'نص الإعلان {i}', image_url=None, button_text=None, button_url=None,
             announcement_type='info', is_active=False, created_at=f'2026-10-0{i}T10:00:00Z', updated_at=f'2026-10-0{i}T10:00:00Z')
    r.update(kw); return r

def new_ctx(browser, cfg, width=1280, height=800, scheme='dark', reduced=False):
    ctx = browser.new_context(viewport={'width': width, 'height': height}, color_scheme=scheme,
                              reduced_motion='reduce' if reduced else 'no-preference')
    errors = []
    def route(r):
        url = r.request.url
        if 'cdn.jsdelivr.net/npm/@supabase' in url:
            r.fulfill(status=200, content_type='application/javascript', body=f"window.__ANN_CFG__={json.dumps(cfg)};\n{STUB}")
        elif url.startswith(BASE): r.continue_()
        else: r.abort()
    ctx.route('**/*', route)
    return ctx, errors

def new_page(ctx, errors):
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errors.append('console.error: ' + m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    return page

def open_home(browser, cfg, **kw):
    ctx, errors = new_ctx(browser, cfg, **kw)
    page = new_page(ctx, errors)
    page.goto(f'{BASE}/index.html')
    return ctx, page, errors

def modal_shown(page, timeout=5000):
    try: page.wait_for_selector('.ann-overlay.is-open', timeout=timeout); return True
    except Exception: return False

def settle(page, ms=1500):
    page.wait_for_load_state('load'); page.wait_for_timeout(ms)

def ann_queries(page): return [q for q in page.evaluate('window.__queries') if q['table'] == 'announcements']

with sync_playwright() as p:
    b = p.chromium.launch()

    # ===================== واجهة الطلاب =====================
    print('--- student side ---')

    # 1) لا يوجد إعلان نشط
    ctx, page, errs = open_home(b, {'rows': [row(1), row(2)], 'role': 'anon'})
    settle(page)
    check('1. لا إعلان نشط → لا تظهر أي نافذة', page.locator('.ann-overlay').count() == 0)
    check('1. الاستعلام تم فعلًا (ولم تفشل الصفحة)', len(ann_queries(page)) == 1)
    check('1. الصفحة الرئيسية تعمل (المحتوى مرسوم)', page.locator('#contentArea').inner_text().strip() != '')
    check('1. لا أخطاء JS', not errs, errs)
    ctx.close()

    # 2) يوجد إعلان نشط (مع التحقق من شكل الاستعلام + بعد اكتمال التحميل)
    rows2 = [row(1, is_active=True, announcement_type='support', description='سطر أول\nسطر ثانٍ',
                 image_url=f'{BASE}/assets/images/support-mascot.png', button_text='ادعم المنصة', button_url='https://example.com/donate'), row(2)]
    ctx, page, errs = open_home(b, {'rows': rows2, 'role': 'anon'})
    check('2. يوجد إعلان نشط → تظهر النافذة', modal_shown(page))
    d = page.locator('.ann-dialog')
    check('2. العنوان والنص والنوع يظهرون', d.locator('.ann-title').inner_text() == 'إعلان 1' and 'سطر ثانٍ' in d.locator('.ann-text').inner_text() and 'دعم المنصة' in d.locator('.ann-badge').inner_text())
    check('2. خصائص الوصولية (role=dialog, aria-modal, labelledby)', d.get_attribute('role') == 'dialog' and d.get_attribute('aria-modal') == 'true' and d.get_attribute('aria-labelledby'))
    aq = ann_queries(page)
    check('2. استعلام واحد فقط للإعلانات', len(aq) == 1, len(aq))
    check('2. الاستعلام: is_active=true + limit 1 + single', aq[0]['filters'] == [['is_active', True]] and aq[0]['limit'] == 1 and aq[0]['single'])
    check('2. الاستعلام بأعمدة محددة (لا *)', '*' not in aq[0]['cols'] and 'id' in aq[0]['cols'])
    check('2. لا يُجلب أي إعلان آخر ولا قائمة', all(q['op'] == 'select' for q in aq))
    check('2. الجلب بعد اكتمال تحميل الصفحة (readyState=complete)', aq[0]['readyState'] == 'complete', aq[0]['readyState'])
    check('2. صورة + زر ظاهران', d.locator('.ann-media img').count() == 1 and d.locator('a.ann-btn--primary').count() == 1)
    cta = d.locator('a.ann-btn--primary')
    check('2. الزر: رابط صحيح + _blank + noopener', cta.get_attribute('href') == 'https://example.com/donate' and cta.get_attribute('target') == '_blank' and 'noopener' in cta.get_attribute('rel'))
    page.wait_for_timeout(400)
    check('2. الصورة حُمّلت فعليًا', page.evaluate("document.querySelector('.ann-media img') && document.querySelector('.ann-media img').naturalWidth > 0"))
    check('2. الصفحة محجوزة التمرير أثناء الإعلان', page.evaluate("getComputedStyle(document.body).overflow") == 'hidden')
    page.screenshot(path=f'{SHOTS}/student_desktop_dark_support.png')
    check('2. لا أخطاء JS', not errs, errs)

    # 3) إغلاق + إعادة تحميل في نفس الجلسة
    page.locator('.ann-close').click(); page.wait_for_timeout(450)
    check('3. الإغلاق يزيل النافذة من الـ DOM', page.locator('.ann-overlay').count() == 0)
    check('3. الإغلاق يعيد التمرير', page.evaluate("getComputedStyle(document.body).overflow") != 'hidden')
    check('3. الإغلاق لا يعدّل قاعدة البيانات (الإعلان ما زال نشطًا)', page.evaluate("window.__db.announcements[0].is_active") is True)
    page.reload(); settle(page)
    check('3. إعادة التحميل في نفس الجلسة → لا يظهر مجددًا', page.locator('.ann-overlay').count() == 0)
    # تنقّل داخلي ثم عودة في نفس التبويب
    page.goto(f'{BASE}/login.html'); page.goto(f'{BASE}/index.html'); settle(page)
    check('3. العودة للرئيسية في نفس الجلسة → لا يظهر', page.locator('.ann-overlay').count() == 0)

    # 4) جلسة جديدة (سياق جديد = sessionStorage جديد)
    ctx2, errs2 = new_ctx(b, {'rows': rows2, 'role': 'anon'})
    page2 = new_page(ctx2, errs2); page2.goto(f'{BASE}/index.html')
    check('4. جلسة تصفح جديدة → يظهر الإعلان النشط مجددًا', modal_shown(page2))
    ctx2.close(); ctx.close()

    # 5) تعطيل الإعلان / تفعيل إعلان جديد أثناء جلسة أُغلق فيها القديم
    cfg5 = {'rows': [row(1, is_active=True), row(2)], 'role': 'anon'}
    ctx, page, errs = open_home(b, cfg5)
    modal_shown(page); page.keyboard.press('Escape'); page.wait_for_timeout(450)
    check('5. Esc يغلق النافذة', page.locator('.ann-overlay').count() == 0)
    cfg5['rows'] = [row(1), row(2, is_active=True)]      # المسؤول فعّل الإعلان 2 (فصار الأول غير نشط)
    page.reload()
    check('5. إعلان جديد (id مختلف) يظهر حتى بعد إغلاق القديم في الجلسة', modal_shown(page) and page.locator('.ann-title').inner_text() == 'إعلان 2')
    ctx.close()
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=False), row(2)], 'role': 'anon'})
    settle(page)
    check('5. إعلان معطّل → لا يظهر للطلاب', page.locator('.ann-overlay').count() == 0)
    ctx.close()

    # 6) بدون صورة وبدون زر
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon'})
    modal_shown(page)
    check('6. بدون صورة: لا عنصر صورة', page.locator('.ann-media').count() == 0)
    check('6. بدون زر: لا زر إجراء، ويبقى زر الإغلاق', page.locator('a.ann-btn--primary').count() == 0 and page.locator('.ann-btn--ghost').count() == 1)
    page.screenshot(path=f'{SHOTS}/student_desktop_dark_info_plain.png')
    ctx.close()

    # 7) إغلاق بالنقر على الخلفية وبزر «إغلاق»، وفخ التركيز
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True, button_text='زر', button_url='https://example.com')], 'role': 'anon'})
    modal_shown(page)
    focus_in = page.evaluate("document.querySelector('.ann-dialog').contains(document.activeElement)")
    check('7. التركيز داخل النافذة عند الفتح', focus_in)
    seen = set()
    for _ in range(6):
        page.keyboard.press('Tab')
        seen.add(page.evaluate("document.activeElement.className + '|' + document.querySelector('.ann-dialog').contains(document.activeElement)"))
    check('7. Tab لا يخرج من النافذة (فخ تركيز)', all(s.endswith('|true') for s in seen), seen)
    page.mouse.click(5, 5); page.wait_for_timeout(450)
    check('7. النقر على الخلفية يغلق', page.locator('.ann-overlay').count() == 0)
    ctx.close()
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon'})
    modal_shown(page); page.locator('.ann-btn--ghost').click(); page.wait_for_timeout(450)
    check('7. زر «إغلاق» السفلي يغلق', page.locator('.ann-overlay').count() == 0)
    ctx.close()

    # 8) أمان: HTML/JS في النص + روابط خطرة
    evil = row(1, is_active=True, title='<img src=x onerror="window.__xss=1">عنوان', description='<script>window.__xss=2</script><b>غامق</b>',
               image_url='javascript:window.__xss=3', button_text='اضغط', button_url='javascript:window.__xss=4')
    ctx, page, errs = open_home(b, {'rows': [evil], 'role': 'anon'})
    modal_shown(page); page.wait_for_timeout(300)
    check('8. HTML في العنوان يُعرض نصًّا حرفيًا', page.locator('.ann-title').inner_text() == '<img src=x onerror="window.__xss=1">عنوان')
    check('8. HTML/script في النص يُعرض نصًّا ولا يُنفَّذ', '<script>' in page.locator('.ann-text').inner_text() and page.evaluate('window.__xss') is None)
    check('8. لا عناصر مُحقنة (img/script/b) داخل النافذة', page.locator('.ann-dialog img, .ann-dialog script, .ann-dialog b').count() == 0)
    check('8. رابط الصورة javascript: مرفوض', page.locator('.ann-media').count() == 0)
    check('8. رابط الزر javascript: مرفوض → لا زر', page.locator('a.ann-btn--primary').count() == 0)
    ctx.close()
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True, button_text='ن', button_url='data:text/html,<script>1</script>', image_url='ftp://x/y.png')], 'role': 'anon'})
    modal_shown(page)
    check('8. data:/ftp: مرفوضة أيضًا', page.locator('a.ann-btn--primary').count() == 0 and page.locator('.ann-media').count() == 0)
    ctx.close()

    # 9) فشل صورة
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True, image_url=f'{BASE}/assets/images/__missing__.png')], 'role': 'anon'})
    modal_shown(page); page.wait_for_timeout(600)
    check('9. صورة مكسورة → تُخفى دون كسر النافذة', page.locator('.ann-media').count() == 0 and page.locator('.ann-dialog').count() == 1)
    ctx.close()

    # 10) فشل الاتصال: خطأ / جدول غير موجود / تعليق الطلب
    for mode, label in (('error', 'خطأ من الخادم'), ('missing', 'الجدول غير منفَّذ بعد')):
        ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon', 'mode': mode})
        settle(page)
        check(f'10. {label}: لا نافذة ولا أخطاء JS ولا تعطيل للصفحة', page.locator('.ann-overlay').count() == 0 and not errs and page.locator('#contentArea').inner_text().strip() != '', errs)
        ctx.close()
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon', 'mode': 'hang'})
    settle(page, 2500)
    check('10. طلب معلّق: الصفحة تعمل ولا نافذة (لا حجب)', page.locator('.ann-overlay').count() == 0 and page.locator('#contentArea').inner_text().strip() != '' and not errs, errs)
    page.locator('#contentArea').locator('a, button, .card, [onclick]').first.click(timeout=3000)
    check('10. التفاعل مع الصفحة ممكن أثناء تعليق الطلب', True)
    ctx.close()
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon', 'mode': 'slow'})
    check('10. استجابة بطيئة: تظهر عند وصولها', modal_shown(page))
    ctx.close()

    # 11) مستخدم مسجَّل (غير مسؤول) يرى النشط فقط
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True), row(2)], 'role': 'user'})
    check('11. مستخدم مسجَّل: يرى الإعلان النشط', modal_shown(page) and page.locator('.ann-title').inner_text() == 'إعلان 1')
    ctx.close()

    # 12) الوضع الفاتح/الداكن + الأنواع الثلاثة + أحجام الشاشات
    long_desc = 'نص طويل جدًا للتأكد من التمرير الداخلي وعدم خروج النافذة عن الشاشة. ' * 25
    for scheme_cls, scheme in (('dark', 'dark'), ('light', 'light')):
        for kind in ('info', 'important', 'support'):
            for (w, h, tag) in ((1280, 800, 'desktop'), (768, 1024, 'tablet'), (375, 667, 'mobile')):
                r = row(1, is_active=True, announcement_type=kind, description=long_desc if kind == 'important' else 'نص قصير للإعلان يشرح الفكرة ببساطة.',
                        image_url=f'{BASE}/assets/images/support-mascot.png' if kind == 'support' else None,
                        button_text='اعرف المزيد' if kind != 'info' else None, button_url='https://example.com' if kind != 'info' else None)
                ctx, page, errs = open_home(b, {'rows': [r], 'role': 'anon'}, width=w, height=h, scheme=scheme)
                if scheme_cls == 'light': page.add_init_script("document.documentElement.classList.add('light-mode')")
                if scheme_cls == 'light':
                    page.evaluate("document.documentElement.classList.add('light-mode'); document.body.classList.add('light-mode')")
                modal_shown(page); page.wait_for_timeout(450)
                box = page.locator('.ann-dialog').bounding_box()
                vw = page.evaluate('window.innerWidth'); vh = page.evaluate('window.innerHeight')
                fits = box and box['x'] >= 0 and box['y'] >= 0 and box['x'] + box['width'] <= vw + 0.5 and box['y'] + box['height'] <= vh + 0.5
                no_hscroll = page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
                check(f'12. {scheme_cls}/{kind}/{tag}: النافذة داخل الشاشة بلا تمرير أفقي', fits and no_hscroll, (box, vw, vh))
                if kind == 'important':
                    sc = page.evaluate("(() => { const s = document.querySelector('.ann-scroll'); return s.scrollHeight > s.clientHeight; })()")
                    check(f'12. {scheme_cls}/{tag}: النص الطويل يتمرر داخل النافذة', sc)
                if tag == 'mobile' and kind != 'info':
                    stacked = page.evaluate("(() => { const a = document.querySelector('.ann-actions'); return getComputedStyle(a).flexDirection === 'column'; })()")
                    check(f'12. {scheme_cls}/{kind}/mobile: الأزرار متراصة بعرض كامل', stacked)
                bg = page.evaluate("getComputedStyle(document.querySelector('.ann-dialog')).backgroundColor")
                if tag == 'desktop' and kind == 'support':
                    check(f'12. {scheme_cls}: لون الخلفية يتبع الوضع', bg == ('rgb(255, 255, 255)' if scheme_cls == 'light' else 'rgb(30, 41, 59)'), bg)
                if kind in ('support', 'important') and tag in ('desktop', 'mobile'):
                    page.screenshot(path=f'{SHOTS}/student_{tag}_{scheme_cls}_{kind}.png')
                ctx.close()

    # 13) تقليل الحركة
    ctx, page, errs = open_home(b, {'rows': [row(1, is_active=True)], 'role': 'anon'}, reduced=True)
    modal_shown(page); page.locator('.ann-close').click(); page.wait_for_timeout(30)
    check('13. prefers-reduced-motion: الإغلاق فوري بلا انتظار حركة', page.locator('.ann-overlay').count() == 0)
    ctx.close()

    # 14) الصفحات الأخرى لا تتأثر (الإعلان على الصفحة الرئيسية فقط)
    ctx, errs3 = new_ctx(b, {'rows': [row(1, is_active=True)], 'role': 'anon'})
    pg = new_page(ctx, errs3)
    for path in ('login.html', 'faculty/faculty.html', 'about/about.html'):
        pg.goto(f'{BASE}/{path}'); pg.wait_for_timeout(700)
        check(f'14. {path}: لا يظهر الإعلان ولا يُطلب', pg.locator('.ann-overlay').count() == 0 and not [q for q in pg.evaluate('window.__queries') if q['table'] == 'announcements'])
    ctx.close()

    # ===================== copy_text =====================
    print('--- copy_text ---')
    def copy_case(rows_, label, grant=True):
        ctx = b.new_context(viewport={'width': 1280, 'height': 800}, color_scheme='dark')
        if grant: ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=BASE)
        errs_ = []
        def route(r):
            u = r.request.url
            if 'cdn.jsdelivr.net/npm/@supabase' in u: r.fulfill(status=200, content_type='application/javascript', body=f"window.__ANN_CFG__={json.dumps({'rows': rows_, 'role': 'anon'})};\n{STUB}")
            elif u.startswith(BASE): r.continue_()
            else: r.abort()
        ctx.route('**/*', route)
        pg = ctx.new_page(); pg.on('pageerror', lambda e: errs_.append(str(e)))
        pg.add_init_script("window.__opened=[];window.open=function(u){window.__opened.push(u);return null;}")
        pg.goto(f'{BASE}/index.html'); modal_shown(pg)
        return ctx, pg, errs_

    # 1) copy_text + button_text: زر نسخ يعمل
    ctx, pg, e_ = copy_case([row(1, is_active=True, button_text='انسخ رقم فودافون كاش', copy_text='01012345678')], 'c1')
    btn = pg.locator('.ann-actions button.ann-btn--primary')
    check('copy 1. يظهر زر نسخ بنص button_text', btn.count() == 1 and 'انسخ رقم فودافون كاش' in btn.inner_text() and pg.locator('a.ann-btn--primary').count() == 0)
    btn.click(); pg.wait_for_timeout(300)
    check('copy 1. المحتوى نُسخ إلى الحافظة فعليًا', pg.evaluate('navigator.clipboard.readText()') == '01012345678')
    check('copy 1. رسالة «تم النسخ بنجاح» تظهر', 'تم النسخ بنجاح' in pg.locator('.ann-copy-status').inner_text())
    check('copy 1. لم يُفتح أي رابط خارجي', pg.evaluate('window.__opened.length') == 0 and len(pg.context.pages) == 1)
    check('copy 1. النافذة تبقى مفتوحة ولا أخطاء JS', pg.locator('.ann-overlay.is-open').count() == 1 and not e_, e_)
    pg.screenshot(path=f'{SHOTS}/student_copy_dark.png'); ctx.close()

    # فشل النسخ: Clipboard API يرفض + execCommand يفشل
    ctx, pg, e_ = copy_case([row(1, is_active=True, button_text='انسخ', copy_text='abc')], 'c1f', grant=False)
    pg.evaluate("navigator.clipboard.writeText = () => Promise.reject(new Error('denied')); document.execCommand = () => false;")
    pg.locator('.ann-actions button.ann-btn--primary').click(); pg.wait_for_timeout(300)
    check('copy 1. عند فشل النسخ تظهر رسالة فشل مناسبة', 'تعذّر النسخ' in pg.locator('.ann-copy-status.is-error').inner_text())
    ctx.close()

    # بديل execCommand عند غياب Clipboard API
    ctx, pg, e_ = copy_case([row(1, is_active=True, button_text='انسخ', copy_text='abc')], 'c1g', grant=False)
    pg.evaluate("Object.defineProperty(navigator, 'clipboard', {value: undefined, configurable: true}); window.__ec=0; document.execCommand = () => { window.__ec++; return true; };")
    pg.evaluate('window.__ec = 0'); pg.locator('.ann-actions button.ann-btn--primary').click(); pg.wait_for_timeout(300)
    check('copy 1. بدون Clipboard API يعمل البديل execCommand', pg.evaluate('window.__ec') == 1 and 'تم النسخ بنجاح' in pg.locator('.ann-copy-status').inner_text())
    ctx.close()

    # 2) button_url فقط: رابط عادي
    ctx, pg, e_ = copy_case([row(1, is_active=True, button_text='زر', button_url='https://example.com/x')], 'c2')
    a = pg.locator('a.ann-btn--primary')
    check('copy 2. button_url فقط: رابط عادي كما كان', a.count() == 1 and a.get_attribute('href') == 'https://example.com/x' and pg.locator('.ann-actions button.ann-btn--primary').count() == 0)
    ctx.close()

    # 3) الاثنان معًا: الأولوية للنسخ
    ctx, pg, e_ = copy_case([row(1, is_active=True, button_text='زر', button_url='https://example.com/x', copy_text='VALUE')], 'c3')
    check('copy 3. الاثنان معًا: زر نسخ فقط وبلا رابط', pg.locator('.ann-actions button.ann-btn--primary').count() == 1 and pg.locator('a.ann-btn--primary').count() == 0)
    pg.locator('.ann-actions button.ann-btn--primary').click(); pg.wait_for_timeout(300)
    check('copy 3. الضغط ينسخ ولا يفتح الرابط', pg.evaluate('navigator.clipboard.readText()') == 'VALUE' and pg.evaluate('window.__opened.length') == 0)
    ctx.close()

    # 4) لا شيء: لا زر
    ctx, pg, e_ = copy_case([row(1, is_active=True), row(2, is_active=False, copy_text='x')], 'c4')
    check('copy 4. بلا copy_text ولا رابط: لا زر إجراء', pg.locator('.ann-actions .ann-btn--primary').count() == 0)
    ctx.close()
    ctx, pg, e_ = copy_case([row(1, is_active=True, copy_text='   ')], 'c4b')
    check('copy 4. copy_text مسافات فقط: لا زر', pg.locator('.ann-actions .ann-btn--primary').count() == 0)
    ctx.close()

    # copy_text بلا button_text: نص احتياطي «نسخ»، ويعمل مع أي نوع إعلان
    for t in ('info', 'important', 'support'):
        ctx, pg, e_ = copy_case([row(1, is_active=True, announcement_type=t, copy_text='V')], 'c7' + t)
        check(f'copy 7. النوع {t}: زر «نسخ» الاحتياطي يظهر', 'نسخ' in pg.locator('.ann-actions button.ann-btn--primary').inner_text())
        ctx.close()

    # 6) إعلان قديم بلا عمود copy_text أصلًا في الصف
    old = row(1, is_active=True, button_text='ادعم', button_url='https://example.com/d'); old.pop('copy_text', None)
    ctx, pg, e_ = copy_case([old], 'c6')
    check('copy 6. إعلان قديم بلا copy_text: يعمل برابط ولا أخطاء', pg.locator('a.ann-btn--primary').count() == 1 and not e_, e_)
    ctx.close()

    # الاستعلام يطلب copy_text (أعمدة محددة وليس *)
    ctx, pg, e_ = copy_case([row(1, is_active=True, copy_text='x')], 'cq')
    aq_ = ann_queries(pg)
    check('copy. الاستعلام يجلب copy_text بأعمدة محددة وبنفس الشروط', 'copy_text' in aq_[0]['cols'] and '*' not in aq_[0]['cols'] and aq_[0]['filters'] == [['is_active', True]] and aq_[0]['limit'] == 1)
    ctx.close()

    b.close()

passed = sum(1 for r in results if r['pass']); total = len(results)
print(f'\n=== student: {passed}/{total} passed ===')
json.dump(results, open(os.path.join(HERE, 'student_results.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(0 if passed == total else 1)
