/**
 * لوحة إنجاز الطالب - الهندسة الزراعية
 * المواد تتحمل من Supabase، وتقدّم الطالب والأهداف والملاحظات تتخزن محلياً في المتصفح.
 */
import { APP_CONFIG } from './config.js';
import { INITIAL_DATA } from './dashboard-data.js';
import { supabaseClient } from './supabase-client.js';

const $ = id => document.getElementById(id);
const clone = o => JSON.parse(JSON.stringify(o));
const YEARS = { '1': 'الفرقة الأولى', '2': 'الفرقة الثانية', '3': 'الفرقة الثالثة', '4': 'الفرقة الرابعة' };
const TERMS = { '1': 'الترم الأول', '2': 'الترم الثاني' };
const invert = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));

let appState = {};
let remoteSubjects = [];
let loadStatus = 'loading'; // loading | ready | error
let toastTimer;
let editingId = null;

const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');
const today = () => new Date().toLocaleDateString('en-CA');
const icons = () => window.lucide && window.lucide.createIcons();

/* ---------- الحفظ والتحميل ---------- */
function migrate(d) {
    const base = clone(INITIAL_DATA);
    const s = { ...base, ...d, userProfile: { ...base.userProfile, ...(d.userProfile || {}) } };
    s.progress = d.progress && typeof d.progress === 'object' ? d.progress : {};
    s.goals = Array.isArray(d.goals) ? d.goals : [];
    s.version = APP_CONFIG.DATA_VERSION;
    delete s.subjects; delete s.studyLogs;
    return s;
}

function loadState() {
    try {
        const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
        appState = migrate(raw ? JSON.parse(raw) : {});
    } catch (err) {
        console.error('تعذر قراءة البيانات المحفوظة:', err);
        appState = migrate({});
    }
}

function persist() {
    try {
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(appState));
        return true;
    } catch (err) {
        console.error(err);
        showToast('خطأ في الحفظ', 'مساحة التخزين في المتصفح ممتلئة أو غير متاحة.', 'error');
        return false;
    }
}

function applySharedTheme(theme) {
    const isDark = theme !== 'light';

    appState.theme = isDark ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', isDark);

    const themeToggle = $('theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute(
            'aria-label',
            isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'
        );
        themeToggle.setAttribute(
            'title',
            isDark ? 'الوضع الليلي' : 'الوضع النهاري'
        );
    }
}

window.addEventListener('storage', (event) => {
    if (event.key !== 'theme') return;

    applySharedTheme(event.newValue);
});
function saveState() { if (persist()) renderAll(); }

/* ---------- الإشعارات ---------- */
const TOAST = { success: ['check-circle-2', 'emerald'], error: ['alert-circle', 'red'], warning: ['alert-triangle', 'amber'], info: ['info', 'blue'] };

function showToast(title, message, type = 'info') {
    const box = $('toast-container');
    if (!box) return;
    const [icon, color] = TOAST[type] || TOAST.info;
    $('toast-title').textContent = title;
    $('toast-message').textContent = message;
    $('toast-icon-wrap').innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 text-${color}-500"></i>`;
    box.className = `fixed bottom-5 left-5 right-5 sm:right-auto z-[60] max-w-sm flex items-start gap-3 rounded-xl p-4 border border-slate-200 dark:border-slate-700 border-s-4 border-s-${color}-500 bg-white dark:bg-slate-900 shadow-lg`;
    icons();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.add('hidden'), 4000);
}

/* ---------- حسابات مساعدة ---------- */
const termCourses = () => remoteSubjects.filter(s =>
    s.year === String(appState.userProfile.academicYear) && s.term === String(appState.userProfile.academicTerm));

function setProgress(c, patch) {
    Object.assign(c, patch);
    appState.progress[c.id] = { totalFiles: c.totalFiles, reviewedFiles: c.reviewedFiles, link: c.link };
    saveState();
}

/* ---------- العرض ---------- */
function renderHeaderAndProfile() {
    const p = appState.userProfile;
    const name = p.studentName || 'طالب هندسة زراعية';
    $('student-name-display').textContent = name;
    $('header-user-name').textContent = name;
    $('user-avatar-badge').textContent = name.trim().split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2) || '--';
    $('student-academic-badge').textContent = `${YEARS[p.academicYear] || ''} • ${TERMS[p.academicTerm] || ''}`;
    $('student-quote-display').textContent = `"${p.quote || INITIAL_DATA.userProfile.quote}"`;
    const notes = $('student-quick-notes');
    if (document.activeElement !== notes) notes.value = p.quickNotes || '';
    $('main-year-select').value = p.academicYear;
    $('main-term-select').value = p.academicTerm;
}

function renderStatsOverview() {
    const list = termCourses();
    const total = list.reduce((a, c) => a + c.totalFiles, 0);
    const done = list.reduce((a, c) => a + c.reviewedFiles, 0);
    const pct = total ? Math.round(done / total * 100) : 0;
    $('stat-total-courses').textContent = loadStatus === 'ready' ? list.length : '--';
    $('stat-total-files').textContent = total ? `${pct}%` : '--';
    $('stat-files-sub').textContent = total ? `${done} من ${total} محاضرة تمت مراجعتها` : 'حدّد عدد المحاضرات لكل مادة';

    const goals = appState.goals, doneGoals = goals.filter(g => g.completed).length;
    $('stat-completed-goals').textContent = `${doneGoals} / ${goals.length}`;
    $('stat-goals-ratio').textContent = `${goals.length ? Math.round(doneGoals / goals.length * 100) : 0}% نسبة الإنجاز`;
    $('stat-gpa-display').textContent = appState.userProfile.gpa || 'غير محدد';
    $('stat-academic-year-label').textContent = YEARS[appState.userProfile.academicYear] || '';
}

function courseCard(c) {
    const total = c.totalFiles, rev = c.reviewedFiles;
    const pct = total ? Math.round(rev / total * 100) : 0;
    const done = total > 0 && rev >= total;
    const link = safeUrl(c.link);
    const btn = 'inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
    return `
    <article class="course-card">
        <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white leading-snug">${escapeHtml(c.name)}</h3>
                    ${c.department ? `<span class="text-[10px] text-slate-400">${escapeHtml(c.department)}</span>` : ''}
                </div>
                <button type="button" data-action="edit" data-id="${escapeHtml(c.id)}" aria-label="تعديل المادة" title="تعديل المادة" class="${btn} text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>مراجعة المحاضرات</span>
                <span class="font-bold text-slate-700 dark:text-slate-200">${total ? `${rev} من ${total}` : 'غير محدد'}</span>
            </div>
            <div class="progress-bar-bg" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'}">${done ? '✓ تمت المراجعة' : `${pct}% مكتمل`}</span>
            <div class="flex items-center gap-1">
                ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 h-7 text-xs font-bold rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"><i data-lucide="external-link" class="w-3.5 h-3.5"></i>الملفات</a>` : ''}
                <button type="button" data-action="dec" data-id="${escapeHtml(c.id)}" ${rev <= 0 ? 'disabled' : ''} aria-label="تراجع عن مراجعة" title="تراجع" class="${btn} bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
                <button type="button" data-action="inc" data-id="${escapeHtml(c.id)}" ${rev >= total ? 'disabled' : ''} class="inline-flex items-center gap-1 px-2.5 h-7 text-xs font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><i data-lucide="plus" class="w-3.5 h-3.5"></i>سجّل مراجعة</button>
            </div>
        </div>
    </article>`;
}

function renderCoursesList() {
    const box = $('courses-container'), empty = $('courses-empty-state');
    if (loadStatus === 'loading') {
        empty.classList.add('hidden');
        box.innerHTML = `<div class="col-span-full py-12 text-center space-y-3"><div class="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div><p class="text-xs text-slate-500">جاري تحميل المواد الدراسية...</p></div>`;
        return;
    }
    if (loadStatus === 'error') {
        empty.classList.add('hidden');
        box.innerHTML = `<div class="col-span-full py-10 text-center space-y-3"><i data-lucide="wifi-off" class="w-9 h-9 mx-auto text-red-400"></i><p class="text-sm font-semibold text-slate-600 dark:text-slate-300">تعذر تحميل المواد. تأكد من الاتصال بالإنترنت.</p><button id="retry-load-btn" type="button" class="px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl">إعادة المحاولة</button></div>`;
        icons();
        return;
    }
    const q = $('course-search-input').value.trim().toLowerCase();
    
const year = String(appState.userProfile.academicYear);
const dep = $('main-department-select').value;

const list = termCourses()
    .filter(c => {
        const matchesName = c.name.toLowerCase().includes(q);

        // أولى وثانية: كل المواد العامة بلا فلتر أقسام
        if (year === '1' || year === '2') {
            return matchesName;
        }

        // ثالثة ورابعة: التصفية حسب القسم المختار
        return matchesName && (!dep || c.department === dep);
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    box.innerHTML = list.map(courseCard).join('');

    empty.classList.toggle('hidden', list.length > 0);

    icons();
}


function renderDepartments() {
    const sel = $('main-department-select');
    const year = String(appState.userProfile.academicYear);

    // أولى وثانية: مفيش اختيار أقسام
    if (year === '1' || year === '2') {
        sel.innerHTML = '';
        sel.value = '';
        sel.disabled = true;
        sel.classList.add('hidden');
        return;
    }

    // ثالثة ورابعة: إظهار الأقسام الموجودة في الفرقة والترم المختارين
    sel.disabled = false;
    sel.classList.remove('hidden');

    const current = sel.value;

    const deps = [
        ...new Set(termCourses().map(s => s.department).filter(Boolean))
    ].sort((a, b) => a.localeCompare(b, 'ar'));

    sel.innerHTML =
        '<option value="">كل الأقسام</option>' +
        deps.map(d =>
            `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`
        ).join('');

    sel.value = deps.includes(current) ? current : '';
}

function renderGoalsList() {
    const box = $('goals-list-container'), empty = $('goals-empty-state');
    const goals = appState.goals;
    $('goals-count-badge').textContent = `${goals.filter(g => g.completed).length}/${goals.length}`;
    empty.classList.toggle('hidden', goals.length > 0);
    box.innerHTML = goals.map(g => `
        <div class="goal-item ${g.completed ? 'completed' : ''}">
            <div class="flex items-center gap-2.5 flex-grow overflow-hidden pr-1">
                <button type="button" class="toggle-goal-btn shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${g.completed ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'}" data-id="${escapeHtml(g.id)}" role="checkbox" aria-checked="${!!g.completed}" aria-label="تم إنجاز: ${escapeHtml(g.title)}">${g.completed ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}</button>
                <span class="goal-title text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title="${escapeHtml(g.title)}">${escapeHtml(g.title)}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">${escapeHtml(g.category || 'عام')}</span>
                <button type="button" class="delete-goal-btn text-slate-400 hover:text-red-500 p-1" data-id="${escapeHtml(g.id)}" title="حذف الهدف" aria-label="حذف الهدف"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
            </div>
        </div>`).join('');
    icons();
}

function renderAll() {
    renderHeaderAndProfile();
    renderStatsOverview();
    renderCoursesList();
    renderGoalsList();
}

/* ---------- النوافذ المنبثقة ---------- */
function openModal(id) {
    const m = $(id);
    m.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const first = m.querySelector('input,select,textarea');
    if (first) setTimeout(() => first.focus(), 30);
}
function closeModal(id) {
    $(id).classList.add('hidden');
    if (!document.querySelector('.modal-backdrop:not(.hidden)')) document.body.classList.remove('overflow-hidden');
}

function openCourseModal(c) {
    editingId = c.id;
    $('course-modal-name').textContent = c.name;
    $('input-course-total').value = c.totalFiles;
    $('input-course-reviewed').value = c.reviewedFiles;
    $('input-course-link').value = c.link;
    openModal('course-modal');
}

function setupModals() {
    [['profile-modal', ['close-profile-modal-btn', 'cancel-profile-btn']],
     ['goal-modal', ['close-goal-modal-btn', 'cancel-goal-btn']],
     ['course-modal', ['close-course-modal-btn', 'cancel-course-btn']]].forEach(([id, btns]) => {
        btns.forEach(b => $(b).addEventListener('click', () => closeModal(id)));
        $(id).addEventListener('click', e => { if (e.target === $(id)) closeModal(id); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(m => closeModal(m.id));
    });

    const openProfile = () => {
        const p = appState.userProfile;
        $('input-student-name').value = p.studentName || '';
        $('input-student-gpa').value = p.gpa || '';
        $('input-student-quote').value = p.quote || '';
        openModal('profile-modal');
    };
    $('open-profile-modal-btn').addEventListener('click', openProfile);
    $('edit-profile-btn').addEventListener('click', openProfile);
    $('profile-form').addEventListener('submit', e => {
        e.preventDefault();
        const p = appState.userProfile;
        p.studentName = $('input-student-name').value.trim() || INITIAL_DATA.userProfile.studentName;
        p.gpa = $('input-student-gpa').value.trim();
        p.quote = $('input-student-quote').value.trim();
        saveState();
        closeModal('profile-modal');
        showToast('تم الحفظ', 'تم تحديث بياناتك الشخصية بنجاح.', 'success');
    });

    const openGoal = () => openModal('goal-modal');
    $('add-goal-btn').addEventListener('click', openGoal);
    $('add-first-goal-btn').addEventListener('click', openGoal);
    $('goal-form').addEventListener('submit', e => {
        e.preventDefault();
        const title = $('input-goal-title').value.trim();
        if (!title) return;
        appState.goals.unshift({ id: 'goal_' + Date.now(), title, category: $('input-goal-category').value, completed: false, createdAt: today() });
        saveState();
        $('goal-form').reset();
        closeModal('goal-modal');
        showToast('تمت الإضافة', 'تم إدراج الهدف الأكاديمي بنجاح.', 'success');
    });

    $('course-form').addEventListener('submit', e => {
        e.preventDefault();
        const c = remoteSubjects.find(s => s.id === editingId);
        if (!c) return closeModal('course-modal');
        const total = parseInt($('input-course-total').value, 10);
        const rev = parseInt($('input-course-reviewed').value, 10) || 0;
        const link = $('input-course-link').value.trim();
        if (!(total >= 0) || rev < 0 || rev > total) return showToast('بيانات غير صحيحة', 'عدد المحاضرات المراجَعة لازم يكون بين 0 والإجمالي.', 'warning');
        if (link && !safeUrl(link)) return showToast('رابط غير صحيح', 'الرابط لازم يبدأ بـ http:// أو https://', 'warning');
        setProgress(c, { totalFiles: total, reviewedFiles: rev, link });
        closeModal('course-modal');
        showToast('تم التحديث', 'تم حفظ بيانات المادة.', 'success');
    });
}

/* ---------- الأحداث ---------- */
function bindEvents() {
    

$('theme-toggle').addEventListener('click', () => {
    const nextTheme = document.documentElement.classList.contains('dark')
        ? 'light'
        : 'dark';

    try {
        localStorage.setItem('theme', nextTheme);
    } catch (error) {
        console.warn('تعذر حفظ الوضع المختار:', error);
    }

    applySharedTheme(nextTheme);
    persist();
});
    $('toast-close-btn').addEventListener('click', () => $('toast-container').classList.add('hidden'));

    
$('main-year-select').addEventListener('change', e => {
    appState.userProfile.academicYear = e.target.value;
    renderDepartments();
    saveState();
});

$('main-term-select').addEventListener('change', e => {
    appState.userProfile.academicTerm = e.target.value;
    renderDepartments();
    saveState();
});
    $('main-department-select').addEventListener('change', renderCoursesList);
    $('course-search-input').addEventListener('input', renderCoursesList);

    const notes = $('student-quick-notes'), status = $('notes-save-status');
    let timer;
    notes.addEventListener('input', () => {
        status.textContent = 'جارٍ الحفظ...';
        clearTimeout(timer);
        timer = setTimeout(() => {
            appState.userProfile.quickNotes = notes.value;
            status.textContent = persist() ? 'تم الحفظ ✓' : 'تعذر الحفظ';
        }, 600);
    });

    $('courses-container').addEventListener('click', e => {
        if (e.target.closest('#retry-load-btn')) return loadSubjects();
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const c = remoteSubjects.find(s => s.id === btn.dataset.id);
        if (!c) return;
        if (btn.dataset.action === 'edit') return openCourseModal(c);
        const next = c.reviewedFiles + (btn.dataset.action === 'inc' ? 1 : -1);
        if (next < 0 || next > c.totalFiles) return;
        setProgress(c, { reviewedFiles: next });
        if (next === c.totalFiles) showToast('ما شاء الله 🎉', `خلصت مراجعة مادة: ${c.name}`, 'success');
    });

    $('goals-list-container').addEventListener('click', e => {
        const t = e.target.closest('.toggle-goal-btn'), d = e.target.closest('.delete-goal-btn');
        if (t) {
            const g = appState.goals.find(x => x.id === t.dataset.id);
            if (g) { g.completed = !g.completed; saveState(); }
        } else if (d) {
            appState.goals = appState.goals.filter(x => x.id !== d.dataset.id);
            saveState();
        }
    });

    setupModals();
}

/* ---------- تحميل المواد ---------- */
async function loadSubjects() {
    loadStatus = 'loading';
    renderCoursesList();
    try {
        if (!supabaseClient) throw new Error('مكتبة Supabase لم يتم تحميلها');
        const { data, error } = await supabaseClient
            .from('subjects')
            .select('id, name, grade, term, department')
            .eq('program', 'الهندسة الزراعية')
            .limit(500);
        if (error) throw error;

        const gradeMap = invert(YEARS), termMap = invert(TERMS);
        remoteSubjects = (data || []).map(r => {
            const id = String(r.id), p = appState.progress[id] || {};
            const total = Math.max(0, parseInt(p.totalFiles, 10) || 0);
            return {
                id,
                name: String(r.name || 'مادة بدون اسم').trim(),
                year: gradeMap[String(r.grade || '').trim()] || '',
                term: termMap[String(r.term || '').trim()] || '',
                department: String(r.department || '').trim(),
                totalFiles: total,
                reviewedFiles: Math.min(total, Math.max(0, parseInt(p.reviewedFiles, 10) || 0)),
                link: safeUrl(p.link)
            };
        }).filter(s => s.year && s.term);
        loadStatus = 'ready';
        renderDepartments();
    } catch (err) {
        console.error('خطأ في تحميل المواد:', err);
        loadStatus = 'error';
        showToast('تعذر تحميل المواد', 'تحقق من الاتصال بالإنترنت وحاول مرة أخرى.', 'error');
    }
    renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem('theme');
    } catch (error) {
        // التخزين غير متاح
    }

    // الوضع الافتراضي هو الليلي، مثل المنصة الرئيسية
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
        savedTheme = 'dark';
    }

    applySharedTheme(savedTheme);

    bindEvents();
    renderAll();
    loadSubjects();
});

