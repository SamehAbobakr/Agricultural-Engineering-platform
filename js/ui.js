function renderHome() {
    currentGrade = ''; currentDept = ''; currentTerm = '';
    updateSidebarActive();
    const html = `
        <div class="fade-in">
            <div class="stats-grid">
                <div class="stat-card"><h3>44</h3><p>📚 إجمالي المواد المتاحة</p></div>
                <div class="stat-card"><h3>480</h3><p>🎥 إجمالي المحاضرات</p></div>
                <div class="stat-card"><h3>720</h3><p>📄 ملفات PDF</p></div>
                <div class="stat-card"><h3>35</h3><p>👨‍🏫 أعضاء هيئة التدريس</p></div>
            </div>

            <h2 class="section-title">اختر الفرقة الدراسية</h2>
            <div class="grid-container">
                <div class="card" onclick="selectGrade('الفرقة الأولى')" style="border-top: 4px solid var(--grade-1)">
                    <div class="card-header-icon">📘</div>
                    <h3>الفرقة الأولى</h3>
                    <p class="card-info">المقررات الأساسية العامة وتأسيس العلوم الهندسية.</p>
                    <div class="card-footer"><span>الدخول للفرقة</span><span>←</span></div>
                </div>
                <div class="card" onclick="selectGrade('الفرقة الثانية')" style="border-top: 4px solid var(--grade-2)">
                    <div class="card-header-icon">📗</div>
                    <h3>الفرقة الثانية</h3>
                    <p class="card-info">المقررات الهندسية التأسيسية والرياضيات المتقدمة.</p>
                    <div class="card-footer"><span>الدخول للفرقة</span><span>←</span></div>
                </div>
                <div class="card" onclick="selectGrade('الفرقة الثالثة')" style="border-top: 4px solid var(--grade-3)">
                    <div class="card-header-icon">📙</div>
                    <h3>الفرقة الثالثة</h3>
                    <p class="card-info">بداية التخصص والتفرع للأقسام العلمية الستة.<br><strong style="color:var(--primary-color)">متاح: هندسة القوى والآلات (الترم الأول)</strong></p>
                    <div class="card-footer"><span>الدخول للفرقة</span><span>←</span></div>
                </div>
                <div class="card" onclick="selectGrade('الفرقة الرابعة')" style="border-top: 4px solid var(--grade-4)">
                    <div class="card-header-icon">📕</div>
                    <h3>الفرقة الرابعة</h3>
                    <p class="card-info">التخصص الدقيق ومشاريع التخرج والتطبيقات الهندسية.</p>
                    <div class="card-footer"><span>الدخول للفرقة</span><span>←</span></div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;
}

function renderDepartments() {
    let html = `
        <div class="fade-in">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> > 
                <span>🎓 ${currentGrade}</span>
            </div>
            <h2 class="section-title">اختر القسم العلمي (${currentGrade})</h2>
            <div class="grid-container">
    `;
    departmentsList.forEach(dept => {
        html += `
            <div class="card" onclick="selectDepartment('${dept.name}')">
                <div class="card-header-icon">${dept.icon}</div>
                <h3>${dept.name}</h3>
                <p class="card-info">${dept.desc}</p>
                <div class="card-footer"><span>استعراض المواد</span><span>←</span></div>
            </div>
        `;
    });
    html += `</div></div>`;
    document.getElementById('contentArea').innerHTML = html;
}

function renderTerms() {
    let t1Count = 0;
    let t2Count = 0;

    if (currentDept && subjectsData[currentGrade] && subjectsData[currentGrade][currentDept]) {
        t1Count = subjectsData[currentGrade][currentDept]['الترم الأول'] ? subjectsData[currentGrade][currentDept]['الترم الأول'].length : 0;
        t2Count = subjectsData[currentGrade][currentDept]['الترم الثاني'] ? subjectsData[currentGrade][currentDept]['الترم الثاني'].length : 0;
    } else {
        t1Count = (subjectsData[currentGrade] && subjectsData[currentGrade]['الترم الأول']) ? subjectsData[currentGrade]['الترم الأول'].length : 0;
        t2Count = (subjectsData[currentGrade] && subjectsData[currentGrade]['الترم الثاني']) ? subjectsData[currentGrade]['الترم الثاني'].length : 0;
    }

    let html = `
        <div class="fade-in">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> > 
                <span onclick="selectGrade('${currentGrade}')">🎓 ${currentGrade}</span>
                ${currentDept ? ` > <span onclick="renderDepartments()">🏢 ${currentDept}</span>` : ''}
            </div>
            <h2 class="section-title">اختر الفصل الدراسي</h2>
            <div class="grid-container">
                <div class="card" onclick="selectTerm('الترم الأول')">
                    <div class="card-header-icon">📖</div>
                    <h3>الترم الأول</h3>
                    <p class="card-info">مقررات ومحاضرات الفصل الدراسي الأول<br><strong style="color:var(--primary-color)">عدد المواد: ${t1Count > 0 ? t1Count : 'متوفرة'} مواد</strong></p>
                    <div class="card-footer"><span>عرض المواد</span><span>←</span></div>
                </div>
                <div class="card" onclick="selectTerm('الترم الثاني')">
                    <div class="card-header-icon">📘</div>
                    <h3>الترم الثاني</h3>
                    <p class="card-info">مقررات ومحاضرات الفصل الدراسي الثاني<br><strong style="color:var(--primary-color)">عدد المواد: ${t2Count > 0 ? t2Count : 'قريباً'} مواد</strong></p>
                    <div class="card-footer"><span>عرض المواد</span><span>←</span></div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;
}

function renderSubjects() {
    let subjectsToDisplay = defaultSubjects;

    if (currentDept && subjectsData[currentGrade] && subjectsData[currentGrade][currentDept] && subjectsData[currentGrade][currentDept][currentTerm]) {
        subjectsToDisplay = subjectsData[currentGrade][currentDept][currentTerm];
    } else if (subjectsData[currentGrade] && subjectsData[currentGrade][currentTerm]) {
        subjectsToDisplay = subjectsData[currentGrade][currentTerm];
    }

    let html = `
        <div class="fade-in">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> > 
                <span onclick="selectGrade('${currentGrade}')">🎓 ${currentGrade}</span>
                ${currentDept ? ` <span onclick="renderDepartments()">🏢 ${currentDept}</span>` : ''}
                > <span>📘 ${currentTerm}</span>
            </div>
            <h2 class="section-title">المواد الدراسية (<span style="color:var(--primary-color)">${subjectsToDisplay.length} مواد</span>)</h2>
            <input type="text" class="inner-search" placeholder="🔍 ابحث عن مادة..." oninput="filterSubjects(this.value)">
            <div class="grid-container" id="subjectsGridContainer">
    `;

    subjectsToDisplay.forEach(sub => {
        html += `
            <div class="card" onclick="openMaterialView('${sub.name}')">
                <div class="card-header-icon">${sub.icon}</div>
                <h3>${sub.name}</h3>
                <p class="card-info">👨‍🏫 ${sub.prof}<br>📚 ${sub.lectures} محاضرة | 📄 ${sub.pdfs} ملف PDF</p>
                <div class="card-footer">
                    <span style="color:var(--primary-color)">🟢 ${sub.updated}</span>
                    <span style="font-weight:bold; color:var(--secondary-color)">[دخول المادة]</span>
                </div>
            </div>
        `;
    });
    html += `</div></div>`;
    document.getElementById('contentArea').innerHTML = html;
}

function openMaterialView(subjectName) {
    showLoading(() => {
        let html = `
            <div class="fade-in material-view">
                <div class="breadcrumb">
                    <span onclick="resetView()">🏠 الرئيسية</span> > 
                    <span onclick="renderSubjects()">رجوع للمواد</span>
                </div>
                <h2 class="section-title" style="margin-top:10px;">مادة: ${subjectName}</h2>
                <p style="color:var(--text-muted); margin-bottom:15px;">استعراض شامل لجميع المحاضرات، التكليفات، وملفات الـ PDF الخاصة بالمادة.</p>
                <div class="material-tabs">
                    <button class="tab-btn active">المحاضرات (فيديو)</button>
                    <button class="tab-btn">ملفات الملخصات (PDF)</button>
                    <button class="tab-btn">الامتحانات السابقة</button>
                </div>
                <div class="grid-container" style="margin-top:20px;">
                    <div class="card">
                        <h3>المحاضرة الأولى</h3>
                        <p class="card-info">مقدمة تمهيدية وشرح تفصيلي للمنهج.</p>
                        <div class="card-footer"><span>مشاهدة</span><span>▶</span></div>
                    </div>
                    <div class="card">
                        <h3>المحاضرة الثانية</h3>
                        <p class="card-info">استكمال شرح الأسس والتطبيقات.</p>
                        <div class="card-footer"><span>مشاهدة</span><span>▶</span></div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('contentArea').innerHTML = html;
    });
}

function showLoading(callback) {
    document.getElementById('contentArea').innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري تحميل المحتوى...</p>
        </div>
    `;
    setTimeout(callback, 250);
}

function filterSubjects(query) {
    const cards = document.querySelectorAll('#subjectsGridContainer .card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleGlobalSearch(query) {
    if(!query.trim()) return;
    // يمكن توسيع البحث العام هنا مستقبلاً
}