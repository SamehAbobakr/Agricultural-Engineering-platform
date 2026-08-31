// =========================================
// سجل التنقل الخاص بالمنصة
// =========================================
let navigationHistory = [
    {
        grade: '',
        dept: '',
        term: '',
        subject: null
    }
];

let navigationIndex = 0;

let currentSubject = null;
// =========================================
// حفظ حالة التنقل
// =========================================

function saveNavigationState() {

    const state = {
    grade: currentGrade,
    dept: currentDept,
    term: currentTerm,
    subject: currentSubject
    };

    // لو المستخدم رجع للخلف ثم اختار مسارًا جديدًا
    if (navigationIndex < navigationHistory.length - 1) {
        navigationHistory =
            navigationHistory.slice(0, navigationIndex + 1);
    }

    navigationHistory.push(state);

    navigationIndex++;

    updateNavigationButtons();
}
// =========================================
// الرجوع خطوة
// =========================================

function goBack() {

    if (navigationIndex <= 0) {
        return;
    }

    navigationIndex--;

    const state = navigationHistory[navigationIndex];

    currentGrade = state.grade;
    currentDept = state.dept;
    currentTerm = state.term;
    currentSubject = state.subject || null;

    renderNavigationState();

    updateNavigationButtons();
}
// =========================================
// التقدم خطوة
// =========================================
function goForward() {

    if (navigationIndex >= navigationHistory.length - 1) {
        return;
    }

    navigationIndex++;

    const state = navigationHistory[navigationIndex];

    currentGrade = state.grade;
    currentDept = state.dept;
    currentTerm = state.term;
    currentSubject = state.subject || null;

    renderNavigationState();

    updateNavigationButtons();
}

function renderNavigationState() {

    updateSidebarActive();

    showLoading(() => {

        // لو المستخدم داخل مادة
        if (currentSubject) {
            renderMaterialPage(currentSubject);
            return;
        }

        // الرئيسية
        if (!currentGrade) {
            renderHome();
            return;
        }

        // الفرقة الثالثة أو الرابعة بدون قسم
        if (
            (currentGrade === 'الفرقة الثالثة' ||
             currentGrade === 'الفرقة الرابعة') &&
            !currentDept
        ) {
            renderDepartments();
            return;
        }

        // لا يوجد ترم
        if (!currentTerm) {
            renderTerms();
            return;
        }

        // عرض المواد
        renderSubjects();
    });
}
// =========================================
// تحديث حالة أزرار التنقل
// =========================================

function updateNavigationButtons() {

    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');

    if (!backBtn || !forwardBtn) {
        return;
    }

    backBtn.disabled = navigationIndex <= 0;

    forwardBtn.disabled =
        navigationIndex >= navigationHistory.length - 1;
}

function selectGrade(grade) {
    currentGrade = grade;
    currentDept = '';
    currentTerm = '';

    updateSidebarActive();
    saveNavigationState();

    showLoading(() => {
        if (grade === 'الفرقة الثالثة' || grade === 'الفرقة الرابعة') {
            renderDepartments();
        } else {
            renderTerms();
        }
    });
}

function selectDeptDirect(grade, dept) {
    currentGrade = grade;
    currentDept = dept;
    currentTerm = '';

    updateSidebarActive();

    saveNavigationState();

    showLoading(() => renderTerms());
}

function selectDepartment(deptName) {
    currentDept = deptName;
    currentTerm = '';

    console.log("🏢 القسم المختار:", currentDept);

    saveNavigationState();

    showLoading(() => renderTerms());
}

function selectTerm(termName) {
    currentTerm = termName;

    saveNavigationState();

    showLoading(() => renderSubjects());
}

function resetView() {
    currentGrade = '';
    currentDept = '';
    currentTerm = '';

    saveNavigationState();

    renderHome();
}