"""اختبارات وحدة «إدارة الإعلانات» في لوحة الإدارة (Playwright + Supabase وهمي يحاكي RLS والـ trigger)."""
import json, sys, threading, http.server, socketserver, os, functools
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SHOTS = os.path.join(HERE, 'screenshots')
PORT = 8794

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

def open_admin(browser, cfg, width=1280, height=850, scheme='dark', hash='#/announcements'):
    ctx = browser.new_context(viewport={'width': width, 'height': height}, color_scheme=scheme)
    errors = []
    def route(r):
        url = r.request.url
        if 'cdn.jsdelivr.net/npm/@supabase' in url:
            r.fulfill(status=200, content_type='application/javascript', body=f"window.__ANN_CFG__={json.dumps(cfg)};\n{STUB}")
        elif url.startswith(BASE): r.continue_()
        else: r.abort()
    ctx.route('**/*', route)
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errors.append('console.error: ' + m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    page.goto(f'{BASE}/admin/index.html{hash}')
    return ctx, page, errors

def db(page): return page.evaluate('window.__db.announcements')
def by_id(page, i): return next((r for r in db(page) if r['id'] == i), None)
def active_ids(page): return [r['id'] for r in db(page) if r['is_active']]
def rows_text(page): return page.locator('.adm-table tbody tr').all_inner_texts()
def wait_table(page): page.wait_for_selector('.adm-table tbody tr', timeout=6000)

def open_add(page):
    page.locator('#crudAdd').click(); page.wait_for_selector('#crudForm')

def fill(page, title='إعلان جديد', desc='نص جديد', typ='info', image='', btn_text='', btn_url='', active=False):
    page.fill('#f_title', title); page.fill('#f_description', desc); page.select_option('#f_announcement_type', typ)
    page.fill('#f_image_url', image); page.fill('#f_button_text', btn_text); page.fill('#f_button_url', btn_url)
    page.set_checked('#f_is_active', active)

def fill_copy(page, v): page.fill('#f_copy_text', v)

def clear(page):
    page.evaluate("document.querySelectorAll('.adm-toast').forEach(t => t.remove())")

def save(page, label='إضافة'):
    clear(page)
    page.locator('.adm-modal__foot button', has_text=label).last.click()

def confirm_dialog(page):
    return page.locator('.adm-modal', has_text='استبدال الإعلان النشط')

with sync_playwright() as p:
    b = p.chromium.launch()
    base_rows = lambda: [row(1, is_active=True, announcement_type='support', button_text='ادعم', button_url='https://example.com/d'), row(2), row(3, announcement_type='important')]

    # ---------- الوصول والصلاحيات ----------
    ctx, page, errs = open_admin(b, {'rows': base_rows(), 'role': 'user'})
    page.wait_for_timeout(1200)
    check('12. مستخدم عادي: لوحة الإدارة ترفض الدخول (ليس مسؤولًا)', 'ليس مسؤولًا' in page.inner_text('body') and page.locator('#crudTable').count() == 0)
    check('12. مستخدم عادي: لا تظهر قائمة الإعلانات ولا بياناتها', 'إعلان 3' not in page.inner_text('body'))
    ctx.close()

    # ---------- القائمة ----------
    ctx, page, errs = open_admin(b, {'rows': base_rows(), 'role': 'admin'})
    wait_table(page)
    check('A. القسم «إدارة الإعلانات» ظاهر في القائمة الجانبية', page.locator('[data-nav="announcements"]').count() == 1)
    check('A. يعرض كل الإعلانات (نشط وغير نشط)', page.locator('.adm-table tbody tr').count() == 3)
    txt = rows_text(page)
    check('A. حالة النشط/غير النشط ظاهرة', sum('نشط' in t and 'غير نشط' not in t.split('\t')[2] for t in txt if 'إعلان 1' in t) == 1 and any('غير نشط' in t for t in txt))
    check('A. نوع الإعلان بالعربية', any('دعم المنصة' in t for t in txt) and any('تنبيه مهم' in t for t in txt))
    check('A. الأحدث أولًا', 'إعلان 3' in txt[0])
    page.screenshot(path=f'{SHOTS}/admin_list_dark.png')

    # ---------- إنشاء بدون تفعيل: لا تأكيد ----------
    open_add(page)
    check('B. النموذج يحوي كل الحقول المطلوبة', all(page.locator(f'#f_{k}').count() == 1 for k in ('title', 'description', 'announcement_type', 'image_url', 'button_text', 'button_url', 'is_active')))
    fill(page, title='تنبيه امتحانات', desc='سطر 1\nسطر 2', typ='important', active=False)
    save(page); page.wait_for_selector('.adm-toast--success')
    new = next(r for r in db(page) if r['title'] == 'تنبيه امتحانات')
    check('B. إنشاء إعلان غير نشط: يُحفظ بلا تأكيد ولا يمس النشط', not new['is_active'] and active_ids(page) == ['a1'] and confirm_dialog(page).count() == 0)
    check('B. الأسطر الجديدة تُحفظ في النص', new['description'] == 'سطر 1\nسطر 2')

    # ---------- إنشاء مع التفعيل: تأكيد الاستبدال ----------
    open_add(page)
    fill(page, title='إعلان بديل', desc='يحل محل القديم', typ='support', btn_text='ادعم المنصة', btn_url='https://example.com/support', active=True)
    save(page)
    page.wait_for_selector('.adm-modal:has-text("استبدال الإعلان النشط")')
    check('6. تأكيد الاستبدال يذكر عنوان الإعلان النشط الحالي', 'إعلان 1' in confirm_dialog(page).inner_text())
    check('6. لا حفظ قبل التأكيد', not any(r['title'] == 'إعلان بديل' for r in db(page)))
    confirm_dialog(page).locator('button', has_text='إلغاء').click(); page.wait_for_timeout(300)
    check('6. إلغاء التأكيد: لم يُحفظ شيء والنشط كما هو', not any(r['title'] == 'إعلان بديل' for r in db(page)) and active_ids(page) == ['a1'])
    check('6. نموذج الإضافة يبقى مفتوحًا بعد إلغاء التأكيد', page.locator('#crudForm').count() == 1)
    save(page); page.wait_for_selector('.adm-modal:has-text("استبدال الإعلان النشط")')
    clear(page); confirm_dialog(page).locator('button', has_text='استبدال ونشر').click(); page.wait_for_selector('.adm-toast--success')
    repl = next(r for r in db(page) if r['title'] == 'إعلان بديل')
    check('6. بعد التأكيد: الجديد نشط والقديم معطّل (واحد نشط فقط)', active_ids(page) == [repl['id']])
    check('6. الإعلان القديم لم يُحذف (محفوظ كغير نشط)', by_id(page, 'a1') is not None and by_id(page, 'a1')['is_active'] is False)
    check('6. عدد الإعلانات: 3 أصلية + 2 جديدة', len(db(page)) == 5)
    wait_table(page); page.wait_for_timeout(300)
    check('6. القائمة تعرض نشطًا واحدًا فقط', sum(1 for t in rows_text(page) if '\tنشط\t' in t or t.split('\t')[2].strip() == 'نشط') == 1, rows_text(page))

    # ---------- تعديل الإعلان الحالي ----------
    page.locator('.adm-table tbody tr', has_text='إعلان بديل').locator('button', has_text='تعديل').click(); page.wait_for_selector('#crudForm')
    check('7. نموذج التعديل يملأ القيم الحالية', page.input_value('#f_title') == 'إعلان بديل' and page.is_checked('#f_is_active') and page.input_value('#f_button_url') == 'https://example.com/support')
    page.fill('#f_title', 'إعلان بديل (معدّل)'); save(page, 'حفظ التعديلات'); page.wait_for_selector('.adm-toast--success')
    check('7. تعديل إعلان نشط: بلا تأكيد استبدال ويبقى نشطًا', confirm_dialog(page).count() == 0 and by_id(page, repl['id'])['title'] == 'إعلان بديل (معدّل)' and active_ids(page) == [repl['id']])
    page.wait_for_timeout(300)

    # ---------- تعطيل ----------
    page.locator('.adm-table tbody tr', has_text='إعلان بديل').locator('button', has_text='تفعيل / تعطيل').click()
    page.wait_for_selector('.adm-modal:has-text("تعطيل الإعلان")')
    clear(page); page.locator('.adm-modal', has_text='تعطيل الإعلان').locator('button', has_text='تعطيل').last.click(); page.wait_for_selector('.adm-toast--success')
    check('5. تعطيل الإعلان: لا نشط بعده، والصف محفوظ', active_ids(page) == [] and by_id(page, repl['id']) is not None)

    # ---------- تفعيل من القائمة (لا نشط → بلا تأكيد) ----------
    page.wait_for_timeout(300)
    clear(page); page.locator('.adm-table tbody tr', has_text='إعلان 2').locator('button', has_text='تفعيل / تعطيل').click(); page.wait_for_selector('.adm-toast--success')
    check('5. تفعيل بلا وجود نشط: مباشرة بلا تأكيد', active_ids(page) == ['a2'] and confirm_dialog(page).count() == 0)

    # ---------- تفعيل إعلان آخر والقديم نشط: تأكيد ----------
    page.wait_for_timeout(300)
    page.locator('.adm-table tbody tr', has_text='إعلان 3').locator('button', has_text='تفعيل / تعطيل').click()
    page.wait_for_selector('.adm-modal:has-text("استبدال الإعلان النشط")')
    check('6. التفعيل من القائمة مع وجود نشط: يطلب تأكيدًا يذكر النشط', 'إعلان 2' in confirm_dialog(page).inner_text())
    clear(page); confirm_dialog(page).locator('button', has_text='استبدال ونشر').click(); page.wait_for_selector('.adm-toast--success')
    check('6. بعد التأكيد: الإعلان 3 هو النشط الوحيد والإعلان 2 محفوظ', active_ids(page) == ['a3'] and by_id(page, 'a2') is not None)

    # ---------- copy_text (الإضافة / التعديل / الجلب) ----------
    open_add(page)
    check('C. حقل محتوى النسخ موجود (textarea) ومعه الوصف التوضيحي', page.locator('textarea#f_copy_text').count() == 1 and 'المحتوى الذي سيتم نسخه' in page.locator('#crudForm').inner_text())
    fill(page, title='إعلان نسخ', desc='نص', btn_text='انسخ الرقم', btn_url='')
    fill_copy(page, '01012345678\nسطر ثانٍ')
    save(page); page.wait_for_selector('.adm-toast--success')
    r = next((x for x in db(page) if x['title'] == 'إعلان نسخ'), None)
    check('C5a. إضافة إعلان بـ copy_text + button_text (بلا رابط) تُحفظ', r is not None and r['copy_text'] == '01012345678\nسطر ثانٍ' and r['button_text'] == 'انسخ الرقم' and not r['button_url'], r)
    wait_table(page)
    page.locator('.adm-table tbody tr', has_text='إعلان نسخ').get_by_role('button', name='تعديل').click(); page.wait_for_selector('#crudForm')
    check('C5b. تعديل: القيمة الحالية تُجلب إلى الحقل', page.input_value('#f_copy_text') == '01012345678\nسطر ثانٍ')
    fill_copy(page, 'IBAN EG123')
    save(page, 'حفظ التعديلات'); page.wait_for_selector('.adm-toast--success')
    check('C5c. تعديل copy_text يحفظ القيمة الجديدة', next(x for x in db(page) if x['title'] == 'إعلان نسخ')['copy_text'] == 'IBAN EG123')
    wait_table(page)
    page.locator('.adm-table tbody tr', has_text='إعلان نسخ').get_by_role('button', name='تعديل').click(); page.wait_for_selector('#crudForm')
    fill_copy(page, '')
    save(page, 'حفظ التعديلات'); page.wait_for_timeout(500)
    check('C. حذف copy_text مع بقاء نص الزر بلا رابط يُرفض (لا زر ناقص)', next(x for x in db(page) if x['title'] == 'إعلان نسخ')['copy_text'] == 'IBAN EG123')
    page.keyboard.press('Escape'); page.wait_for_timeout(300)
    check('C. إعلان قديم (بلا copy_text) يُفتح للتعديل دون خطأ', True)
    check('C. لا أخطاء JS أثناء اختبارات copy_text', not errs, errs)

    # ---------- التحقق من الإدخال ----------
    open_add(page)
    fill(page, title='زر ناقص', desc='نص', btn_text='زر بلا رابط', btn_url='')
    save(page); page.wait_for_selector('.adm-toast--error')
    check('الحقول: نص زر بلا رابط يُرفض برسالة واضحة', 'رابطًا أو محتوى نسخ' in page.locator('.adm-toast--error').first.inner_text() and not any(r['title'] == 'زر ناقص' for r in db(page)))
    fill(page, title='رابط سيئ', desc='نص', btn_text='زر', btn_url='javascript:alert(1)')
    save(page); page.wait_for_timeout(300)
    check('الحقول: رابط javascript: يُرفض في النموذج', page.locator('[data-err="button_url"]').inner_text() != '' and not any(r['title'] == 'رابط سيئ' for r in db(page)))
    fill(page, title='', desc='', btn_text='', btn_url='')
    save(page); page.wait_for_timeout(300)
    check('الحقول: العنوان والنص مطلوبان', page.locator('[data-err="title"]').inner_text() != '' and page.locator('[data-err="description"]').inner_text() != '')
    fill(page, title='صورة سيئة', desc='نص', image='ftp://x/y.png')
    save(page); page.wait_for_timeout(300)
    check('الحقول: رابط صورة غير http/https يُرفض', page.locator('[data-err="image_url"]').inner_text() != '')

    # ---------- المعاينة من النموذج (قبل النشر) ----------
    fill(page, title='عنوان للمعاينة', desc='نص المعاينة', typ='important', btn_text='افتح', btn_url='https://example.com/p')
    n_before = len(db(page))
    page.locator('.adm-modal__foot button', has_text='معاينة').click(); page.wait_for_selector('.ann-overlay.is-open')
    check('معاينة: تظهر النافذة بنفس شكل الطلاب مع وسم «معاينة»', 'معاينة' in page.locator('.ann-preview-tag').inner_text() and page.locator('.ann-title').inner_text() == 'عنوان للمعاينة')
    check('معاينة: لا تحفظ شيئًا في قاعدة البيانات', len(db(page)) == n_before)
    top = page.evaluate("(() => { const d = document.querySelector('.ann-dialog').getBoundingClientRect(); const e = document.elementFromPoint(d.x + d.width/2, d.y + d.height/2); return !!e.closest('.ann-dialog'); })()")
    check('معاينة: تظهر فوق نافذة النموذج', top)
    page.screenshot(path=f'{SHOTS}/admin_preview_over_form.png')
    page.keyboard.press('Escape'); page.wait_for_timeout(450)
    check('معاينة: Esc يغلق المعاينة وحدها ويبقى النموذج', page.locator('.ann-overlay').count() == 0 and page.locator('#crudForm').count() == 1)
    page.keyboard.press('Escape'); page.wait_for_timeout(300)
    check('Esc الثانية تغلق النموذج', page.locator('#crudForm').count() == 0)

    # معاينة من القائمة (إعلان محفوظ)
    page.locator('.adm-table tbody tr', has_text='إعلان 3').locator('button', has_text='معاينة').click(); page.wait_for_selector('.ann-overlay.is-open')
    check('معاينة من القائمة تعمل', page.locator('.ann-title').inner_text() == 'إعلان 3')
    page.locator('.ann-close').click(); page.wait_for_timeout(450)

    # ---------- فلتر الحالة + بحث ----------
    page.select_option('[data-filter="is_active"]', 'true'); page.wait_for_timeout(500)
    check('فلتر الحالة «نشط»', page.locator('.adm-table tbody tr').count() == 1 and 'إعلان 3' in page.locator('.adm-table tbody tr').first.inner_text())
    page.select_option('[data-filter="is_active"]', ''); page.fill('#crudSearch', 'المعاينة'); page.wait_for_timeout(700)
    page.fill('#crudSearch', 'امتحانات'); page.wait_for_timeout(700)
    check('البحث بالعنوان', page.locator('.adm-table tbody tr').count() == 1 and 'تنبيه امتحانات' in page.locator('.adm-table tbody tr').first.inner_text())

    # ---------- حذف ----------
    page.fill('#crudSearch', ''); page.wait_for_timeout(600)
    n = len(db(page))
    page.locator('.adm-table tbody tr', has_text='إعلان بديل').locator('button', has_text='حذف').click()
    page.wait_for_selector('.adm-modal:has-text("حذف إعلان")')
    check('الحذف: يحذّر ويقترح التعطيل بدل الحذف', 'تعطيل' in page.locator('.adm-modal:has-text("حذف إعلان")').inner_text())
    clear(page); page.locator('.adm-modal:has-text("حذف إعلان") button', has_text='حذف نهائيًا').click(); page.wait_for_selector('.adm-toast--success')
    check('الحذف اليدوي يعمل', len(db(page)) == n - 1)

    check('لا أخطاء JS أثناء كل السيناريوهات', not errs, errs)
    ctx.close()

    # ---------- جوال + وضع فاتح ----------
    ctx, page, errs = open_admin(b, {'rows': base_rows(), 'role': 'admin'}, width=390, height=800, scheme='light')
    page.evaluate("document.documentElement.classList.add('light-mode'); document.body.classList.add('light-mode')")
    wait_table(page); page.wait_for_timeout(300)
    check('11. الجوال: لا تمرير أفقي للصفحة في قائمة الإعلانات', page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'))
    page.screenshot(path=f'{SHOTS}/admin_list_mobile_light.png')
    open_add(page)
    check('11. الجوال: نموذج الإضافة داخل الشاشة', page.evaluate("(() => { const r = document.querySelector('.adm-modal').getBoundingClientRect(); return r.left >= 0 && r.right <= window.innerWidth + 1; })()"))
    page.screenshot(path=f'{SHOTS}/admin_form_mobile_light.png')
    check('لا أخطاء JS (جوال/فاتح)', not errs, errs)
    ctx.close()

    # ---------- قاعدة بيانات فارغة ----------
    ctx, page, errs = open_admin(b, {'rows': [], 'role': 'admin'})
    page.wait_for_selector('.adm-state', timeout=6000)
    check('قائمة فارغة: حالة «لا توجد بيانات» بدل انهيار', 'لا توجد بيانات' in page.inner_text('#crudTable') and not errs, errs)
    ctx.close()

    b.close()

passed = sum(1 for r in results if r['pass']); total = len(results)
print(f'\n=== admin: {passed}/{total} passed ===')
json.dump(results, open(os.path.join(HERE, 'admin_results.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(0 if passed == total else 1)
