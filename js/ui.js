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
        const subJson = JSON.stringify(sub).replace(/"/g, '&quot;');
        html += `
            <div class="card" onclick="openMaterialView(${subJson})">
                <div class="card-header-icon">${sub.icon || '📘'}</div>
                <h3>${sub.name}</h3>
                <p class="card-info">👨‍🏫 ${sub.prof || 'غير متوفر'}<br>📚 ${sub.lectures || 0} محاضرة | 📄 ${sub.pdfs || 0} ملف PDF</p>
                <div class="card-footer">
                    <span style="color:var(--primary-color)">🟢 ${sub.updated || 'حديث'}</span>
                    <span style="font-weight:bold; color:var(--secondary-color)">[دخول المادة]</span>
                </div>
            </div>
        `;
    });
    html += `</div></div>`;
    document.getElementById('contentArea').innerHTML = html;
}

function openMaterialView(subject) {
    showLoading(() => {
        renderMaterialPage(subject);
    });
}

function renderMaterialPage(subject) {
    const deptName = currentDept ? currentDept : (subject.dept || currentGrade);
    const lecturesCount = subject.lectures || 0;
    const pdfsCount = subject.pdfs || 0;
    const lastUpdated = subject.updated || 'غير متوفر';
    const subJson = JSON.stringify(subject).replace(/"/g, '&quot;');

    let html = `
        <div class="fade-in material-view" style="direction: rtl; text-align: right;">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> > 
                <span onclick="renderSubjects()">رجوع للمواد</span>
            </div>
            <h2 class="section-title" style="margin-top:10px;">مادة: ${subject.name}</h2>
            <p style="color:var(--text-muted); margin-bottom:5px;"><strong>القسم التابع لها:</strong> ${deptName} | <strong>الفرقة:</strong> ${currentGrade || subject.grade || 'غير محدد'}</p>
            <p style="color:var(--text-muted); margin-bottom:15px;"><strong>عدد المحاضرات:</strong> ${lecturesCount} | <strong>عدد الملفات:</strong> ${pdfsCount} | <strong>آخر تحديث:</strong> ${lastUpdated}</p>
            
            <!-- بطاقة المساعد الذكي للمادة (تستدعي فقط openAIAssistant الموجودة في ai-assistant.js) -->
            <div class="card" style="margin-bottom: 20px; border-right: 4px solid var(--primary-color); cursor: pointer;" onclick="openAIAssistant(${subJson})">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin-bottom: 5px;">المساعد الذكي للمادة 🤖</h3>
                        <p class="card-info" style="margin: 0;">انقر هنا لاستخدام المساعد الذكي في شرح وتلخيص محتوى المادة.</p>
                    </div>
                    <span style="font-size: 24px; color: var(--primary-color);">💬</span>
                </div>
            </div>

            <!-- منطقة منفصلة لعرض واجهة المساعد الذكي دون المساس بالتبويبات -->
            <div id="aiAssistantArea"></div>

            <div class="material-tabs" id="materialTabsContainer">
                <button class="tab-btn active" onclick="switchMaterialTab(this, 'المحاضرات', ${subJson})">المحاضرات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الكتاب الإلكتروني', ${subJson})">الكتاب الإلكتروني</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'السكاشن', ${subJson})">السكاشن</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الملخصات', ${subJson})">الملخصات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'حل الشيت', ${subJson})">حل الشيت</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الفيديوهات', ${subJson})">الفيديوهات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الامتحانات', ${subJson})">الامتحانات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'أخرى', ${subJson})">أخرى</button>
            </div>
            
            <div id="tabContentArea" style="margin-top:20px;">
                ${renderMaterialContent('المحاضرات', subject)}
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;
}

function switchMaterialTab(btnElement, type, subject) {
    const buttons = document.querySelectorAll('#materialTabsContainer .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const contentArea = document.getElementById('tabContentArea');
    if (contentArea) {
        contentArea.innerHTML = renderMaterialContent(type, subject);
    }
}

function renderMaterialContent(type, subject) {
    let items = [];

    if (subject.content && subject.content[type]) {
        items = subject.content[type];
    } else {
        if (type === 'المحاضرات') {
            items = [
                { title: 'المحاضرة الأولى', description: 'مقدمة تمهيدية وشرح تفصيلي للمنهج.', type: 'video', url: '#', icon: '▶' },
                { title: 'المحاضرة الثانية', description: 'استكمال شرح الأسس والتطبيقات.', type: 'video', url: '#', icon: '▶' }
            ];
        } else if (type === 'الكتاب الإلكتروني') {
            items = [
                { title: 'الكتاب المقرر الرسمي', description: 'نسخة PDF معتمدة للمنهج الدراسي.', type: 'pdf', url: '#', icon: '📥' }
            ];
        } else if (type === 'الامتحانات') {
            items = [
                { title: 'امتحان ترم سابق 2025', description: 'مع النموذج الإجابي الرسمي.', type: 'pdf', url: '#', icon: '📄' }
            ];
        }
    }

    if (!items || items.length === 0) {
        return `<p style="text-align: center; color: var(--text-muted); padding: 30px;">لا توجد ملفات متاحة حالياً</p>`;
    }

    let html = `
    <style>
        .file-action-buttons {
            display: flex;
            gap: 8px;
            width: 100%;
            margin-top: 5px;
        }
        .file-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            border: none;
            outline: none;
            font-family: inherit;
        }
        .file-btn-open {
            background-color: var(--primary-color);
            color: #ffffff;
        }
        .file-btn-open:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .file-btn-download {
            background-color: #0284c7;
            color: #ffffff;
        }
        .file-btn-download:hover {
            background-color: #0369a1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        @media (max-width: 480px) {
            .file-action-buttons {
                flex-direction: column;
                gap: 6px;
            }
            .file-btn {
                width: 100%;
            }
        }
    </style>
    <div class="grid-container">`;

    items.forEach(item => {
        const targetUrl = item.url || '#';

        html += `
            <div class="card">
                <h3>${item.title}</h3>
                <p class="card-info">${item.description || ''}</p>
                <div class="card-footer" style="padding: 10px 15px;">
                    <div class="file-action-buttons">
                        <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="file-btn file-btn-open">
                            <span>👁️</span> <span>فتح</span>
                        </a>
                        <a href="${targetUrl}" download class="file-btn file-btn-download">
                            <span>⬇️</span> <span>تحميل</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
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
}