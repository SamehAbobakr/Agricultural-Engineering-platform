/**
 * announcements.js — إدارة الإعلانات (جدول announcements)
 *
 * إعلان نشط واحد فقط في أي وقت: تضمنه قاعدة البيانات (فهرس فريد جزئي + trigger يعطّل النشط السابق ولا يحذفه)
 * — database/announcements/001_announcements.sql. الواجهة هنا تؤكّد مع المسؤول قبل الاستبدال فقط.
 * المعاينة تستعمل نفس مكوّن الطلاب (js/announcements.js + css/announcements.css) فتطابق ما سيظهر فعلًا.
 * الحماية الحقيقية: RLS (admin_all) وليس إخفاء الأزرار.
 */
(function () {
    'use strict';

    var D = window.AdminDom;
    var html = D.html;

    var TYPES = [
        ['info', 'خبر أو معلومة'],
        ['important', 'تنبيه مهم'],
        ['support', 'دعم المنصة']
    ];

    var TYPE_LABEL = {};
    TYPES.forEach(function (t) { TYPE_LABEL[t[0]] = t[1]; });

    var repo = window.AdminData.createRepository({ table: 'announcements', idKey: 'id' });

    /** يسأل عن الإعلان النشط الحالي (غير excludeId) ويطلب تأكيد الاستبدال. Promise<boolean> */
    function confirmReplace(excludeId, ui) {
        return repo.list({ page: 1, pageSize: 1, filters: { is_active: 'true' } }).then(function (res) {
            var current = !res.error && res.data && res.data[0];

            if (current && current.id === excludeId) return true;     // هو نفسه النشط: لا استبدال
            if (!res.error && !current) return true;                  // لا يوجد نشط: لا حاجة للتأكيد

            var message = current
                ? 'الإعلان «' + current.title + '» نشط حاليًا. سيُعطَّل تلقائيًا (دون حذفه) ويحل هذا الإعلان محله أمام الطلاب.'
                : 'تعذر التحقق من الإعلان النشط الحالي. إن وُجد إعلان نشط فسيُعطَّل تلقائيًا (دون حذفه) ويحل هذا الإعلان محله.';

            return ui.confirm({ title: 'استبدال الإعلان النشط', message: message, confirmLabel: 'استبدال ونشر' });
        });
    }

    window.AdminCrud.define('announcements', {
        table: 'announcements',
        title: 'إدارة الإعلانات', singular: 'إعلان',
        hint: 'يظهر للطلاب إعلان واحد نشط فقط عند فتح المنصة، ويبقى ظاهرًا حتى تعطّله أو تفعّل غيره (يُعطَّل السابق تلقائيًا ولا يُحذف). إغلاق الطالب للنافذة يخفيها عنه في جلسته فقط. الصورة والزر اختياريان (الزر يحتاج نصًّا مع رابط أو مع محتوى نسخ؛ وإن وُجدا معًا فالأولوية للنسخ). استخدم «معاينة» لرؤية الإعلان كما سيظهر قبل نشره.',
        order: { column: 'created_at', ascending: false },
        searchColumns: ['title', 'description'],
        filters: [
            { key: 'announcement_type', label: 'النوع', options: TYPES },
            { key: 'is_active', label: 'الحالة', options: [['true', 'نشط'], ['false', 'غير نشط']] }
        ],
        columns: [
            { key: 'title', label: 'الإعلان', max: 60 },
            { key: 'announcement_type', label: 'النوع', render: function (r) { return TYPE_LABEL[r.announcement_type] || r.announcement_type; } },
            {
                key: 'is_active', label: 'الحالة',
                render: function (r) {
                    return r.is_active
                        ? html`<span class="adm-badge adm-badge--ok">نشط</span>`
                        : html`<span class="adm-badge">غير نشط</span>`;
                }
            },
            { key: 'updated_at', label: 'آخر تعديل', date: true }
        ],
        fields: [
            { key: 'title', label: 'عنوان الإعلان', type: 'text', required: true, maxLength: 150, full: true },
            { key: 'description', label: 'نص الإعلان (نص عادي؛ الأسطر الجديدة تُحفظ)', type: 'textarea', required: true, maxLength: 2000, rows: 6, full: true },
            { key: 'announcement_type', label: 'نوع الإعلان', type: 'select', required: true, options: TYPES },
            { key: 'image_url', label: 'رابط صورة (اختياري)', type: 'url', full: true, placeholder: 'https://...' },
            { key: 'button_text', label: 'نص الزر (اختياري)', type: 'text', maxLength: 40, placeholder: 'مثال: ادعم المنصة' },
            { key: 'button_url', label: 'رابط الزر (اختياري)', type: 'url', placeholder: 'https://...' },
            { key: 'copy_text', label: 'محتوى النسخ (Copy Text)', type: 'textarea', rows: 3, maxLength: 1000, full: true,
              hint: 'المحتوى الذي سيتم نسخه عند ضغط الطالب على الزر، ويمكن أن يكون رقمًا أو نصًا أو أي بيانات أخرى.' },
            { key: 'is_active', label: 'الحالة', type: 'checkbox', checkLabel: 'نشط — يظهر للطلاب فور الحفظ (ويُعطَّل أي إعلان نشط آخر تلقائيًا)' }
        ],
        defaults: { announcement_type: 'info', is_active: false },
        rowLabel: function (r) { return r.title; },
        deleteWarning: 'الأفضل تعطيل الإعلان بدل حذفه للاحتفاظ بسجل الإعلانات السابقة.',

        // الزر: نص + (محتوى نسخ أو رابط). النسخ له الأولوية على الرابط. بلا نص وبلا أيهما: لا زر.
        beforeSave: function (v) {
            var hasText = !!v.button_text, hasUrl = !!v.button_url, hasCopy = !!v.copy_text;
            if (hasUrl && !hasText) return 'رابط الزر يحتاج نص زر: أضف نص الزر أو احذف الرابط.';
            if (hasText && !hasUrl && !hasCopy) return 'نص الزر يحتاج رابطًا أو محتوى نسخ: أكمل أحدهما أو احذف نص الزر.';
            return '';
        },

        // تأكيد قبل استبدال إعلان نشط آخر (عند التفعيل فقط)
        confirmSave: function (v, mode, row, ctx) {
            if (!v.is_active) return true;
            if (mode === 'edit' && row && row.is_active) return true;       // تعديل إعلان نشط أصلًا
            return confirmReplace(mode === 'edit' && row ? row.id : null, ctx.ui);
        },

        // معاينة من النموذج قبل الحفظ (نفس مكوّن الطلاب)
        preview: function (v) {
            if (window.PlatformAnnouncements) window.PlatformAnnouncements.show(v, { preview: true });
        },

        rowActions: [
            {
                label: 'معاينة',
                onClick: function (row) {
                    if (window.PlatformAnnouncements) window.PlatformAnnouncements.show(row, { preview: true });
                }
            },
            {
                label: 'تفعيل / تعطيل',
                onClick: function (row, api) {
                    var ui = api.ctx.ui;

                    function apply(next) {
                        return repo.update(row.id, { is_active: next }).then(function (res) {
                            if (res.error) { ui.toast(res.message, 'error'); return; }
                            ui.toast(next ? 'تم تفعيل الإعلان.' : 'تم تعطيل الإعلان، ولن يظهر للطلاب.', 'success');
                            api.reload();
                        });
                    }

                    if (row.is_active) {
                        ui.confirm({
                            title: 'تعطيل الإعلان',
                            message: 'سيتوقف ظهور «' + row.title + '» للطلاب، ويبقى محفوظًا ويمكن تفعيله لاحقًا.',
                            confirmLabel: 'تعطيل'
                        }).then(function (yes) { if (yes) apply(false); });
                        return;
                    }

                    confirmReplace(row.id, ui).then(function (yes) { if (yes) apply(true); });
                }
            }
        ]
    });
})();
