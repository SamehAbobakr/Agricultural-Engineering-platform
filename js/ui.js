// الكود الكامل المحدث والجاهز للاستبدال المباشر
async function loadSubjectsFromSupabase() {
    try {
        console.log("========== LOAD SUBJECTS ==========");
        console.log("🎓 Grade:", currentGrade);
        console.log("📖 Term:", currentTerm);

        const { data, error } = await supabaseClient
            .from('subjects')
            .select('*')
            .ilike('grade', `%${currentGrade.trim()}%`)
            .ilike('term', `%${currentTerm.trim()}%`);

        if (error) throw error;

        console.log("📘 المواد المسترجعة من Supabase:", data);

        return data || [];

    } catch (error) {
        console.error("❌ خطأ في جلب المواد من Supabase:", error);
        return [];
    }
}
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
                    <p class="card-info">مقررات ومحاضرات الفصل الدراسي الأول</p>
                    <div class="card-footer"><span>عرض المواد</span><span>←</span></div>
                </div>
                <div class="card" onclick="selectTerm('الترم الثاني')">
                    <div class="card-header-icon">📘</div>
                    <h3>الترم الثاني</h3>
                    <p class="card-info">مقررات ومحاضرات الفصل الدراسي الثاني</p>
                    <div class="card-footer"><span>عرض المواد</span><span>←</span></div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;
}

async function renderSubjects() {
    document.getElementById('contentArea').innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري تحميل المواد من Supabase...</p>
        </div>
    `;

    const subjectsToDisplay = await loadSubjectsFromSupabase();

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

    if (!subjectsToDisplay || subjectsToDisplay.length === 0) {
        html += `<p style="text-align: center; color: var(--text-muted); padding: 30px; grid-column: 1 / -1;">لا توجد مواد متاحة حالياً.</p>`;
    } else {
        subjectsToDisplay.forEach(sub => {
            const subJson = JSON.stringify(sub).replace(/"/g, '&quot;');
            const profName = sub.professor || sub.prof || 'غير متوفر';
            const updatedText = sub.updated || 'حديث';
            html += `
                <div class="card" onclick="openMaterialView(${subJson})">
                    <div class="card-header-icon">${sub.icon || '📘'}</div>
                    <h3>${sub.name}</h3>
                    <p class="card-info">👨‍🏫 ${profName}</p>
                    <div class="card-footer">
                        <span style="color:var(--primary-color)">🟢 ${updatedText}</span>
                        <span style="font-weight:bold; color:var(--secondary-color)">[دخول المادة]</span>
                    </div>
                </div>
            `;
        });
    }
    html += `</div></div>`;
    document.getElementById('contentArea').innerHTML = html;
}

function openMaterialView(subject) {
    if (!subject || !subject.id) {
        console.error("❌ بيانات المادة غير صالحة أو مفقود معرف المادة (id):", subject);
        alert("حدث خطأ: بيانات المادة غير صالحة.");
        return;
    }
    showLoading(() => {
        renderMaterialPage(subject);
    });
}

function renderMaterialPage(subject) {
    const deptName = currentDept ? currentDept : (subject.department || subject.dept || currentGrade);
    const lastUpdated = subject.updated || 'غير متوفرة';
    const subJson = JSON.stringify(subject).replace(/"/g, '&quot;');

    let html = `
        <div class="fade-in material-view" style="direction: rtl; text-align: right;">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> > 
                <span onclick="renderSubjects()">رجوع للمواد</span>
            </div>
            <h2 class="section-title" style="margin-top:10px;">مادة: ${subject.name}</h2>
            <p style="color:var(--text-muted); margin-bottom:5px;"><strong>القسم التابع لها:</strong> ${deptName} | <strong>الفرقة:</strong> ${currentGrade || subject.grade || 'غير محدد'}</p>
            <p style="color:var(--text-muted); margin-bottom:15px;"><strong>آخر تحديث:</strong> ${lastUpdated}</p>
            
            <div class="card" style="margin-bottom: 20px; border-right: 4px solid var(--primary-color); cursor: pointer;" onclick="openAIAssistant(${subJson})">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin-bottom: 5px;">المساعد الذكي للمادة 🤖</h3>
                        <p class="card-info" style="margin: 0;">انقر هنا لاستخدام المساعد الذكي في شرح وتلخيص محتوى المادة.</p>
                    </div>
                    <span style="font-size: 24px; color: var(--primary-color);">💬</span>
                </div>
            </div>

            <div id="aiAssistantArea"></div>

            <div class="material-tabs" id="materialTabsContainer">
                <button class="tab-btn active" id="defaultTabBtn" onclick="switchMaterialTab(this, 'المحاضرات', ${subJson})">المحاضرات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الكتاب الاكترونى', ${subJson})">الكتاب الاكترونى</button>                <button class="tab-btn" onclick="switchMaterialTab(this, 'السكاشن', ${subJson})">السكاشن</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الملخصات', ${subJson})">الملخصات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'حل الشيت', ${subJson})">حل الشيت</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الفيديوهات', ${subJson})">الفيديوهات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'الامتحانات', ${subJson})">الامتحانات</button>
                <button class="tab-btn" onclick="switchMaterialTab(this, 'أخرى', ${subJson})">أخرى</button>
            </div>
            
            <div id="tabContentArea" style="margin-top:20px;"></div>
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;

    const firstTabBtn = document.getElementById('defaultTabBtn');
    if (firstTabBtn) {
        switchMaterialTab(firstTabBtn, 'المحاضرات', subject);
    }
}

async function switchMaterialTab(btnElement, type, subject) {
    const buttons = document.querySelectorAll('#materialTabsContainer .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const contentArea = document.getElementById('tabContentArea');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري جلب الملفات...</p>
        </div>
    `;

    if (!subject || !subject.id) {
        contentArea.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 30px;">معرف المادة غير متوفر.</p>`;
        return;
    }

    try {
        console.log("📘 المادة الحالية:", subject);
        console.log("🏷️ التصنيف المطلوب:", type);

        const { data: files, error } = await supabaseClient
            .from('material_files')
            .select('*')
            .eq('subject_id', subject.id);

        if (error) throw error;

        console.log("📂 ملفات المادة المسترجعة:", files);

        const normalizedTargetType = normalizeCategory(type);
        const filteredFiles = (files || []).filter(f => normalizeCategory(f.category) === normalizedTargetType);

        console.log("📚 الملفات بعد الفلترة:", filteredFiles);

        if (!filteredFiles || filteredFiles.length === 0) {
            contentArea.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 30px;">لا توجد ملفات متاحة في هذا القسم حالياً.</p>`;
            return;
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

        filteredFiles.forEach(file => {
            const targetUrl = file.file_url || '#';
            const fileTitle = file.title || 'بدون عنوان';
            const fileDesc = file.description || '';

            html += `
                <div class="card">
                    <h3>${fileTitle}</h3>
                    <p class="card-info">${fileDesc}</p>
                    <div class="card-footer" style="padding: 10px 15px;">
                        <div class="file-action-buttons">
                            <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="file-btn file-btn-open">
                                <span>👁️</span> <span>فتح</span>
                            </a>
                            <button onclick="downloadMaterialFile('${targetUrl}', '${fileTitle}')" class="file-btn file-btn-download">
                                <span>⬇️</span> <span>تحميل</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        contentArea.innerHTML = html;

    } catch (error) {
        console.error("❌ خطأ في جلب ملفات المادة من Supabase:", error);
        contentArea.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 30px;">حدث خطأ أثناء تحميل الملفات.</p>`;
    }
}

async function downloadMaterialFile(url, fileName) {
    if (!url || url === '#') {
        alert("رابط التحميل غير متوفر.");
        return;
    }

    try {
        const response = await fetch(url, {
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const blob = await response.blob();

        // إنشاء رابط مؤقت للملف
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;

        // اسم الملف عند التحميل
        a.download = fileName.toLowerCase().endsWith('.pdf')
            ? fileName
            : `${fileName}.pdf`;

        document.body.appendChild(a);
        a.click();

        // تنظيف
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        }, 1000);

    } catch (error) {
        console.error("❌ فشل تحميل الملف:", error);

        // لو CORS منع التحميل المباشر
        alert("تعذر التحميل المباشر. سيتم فتح الملف، ويمكنك تحميله من عارض PDF.");

        window.open(url, '_blank');
    }
}
function normalizeCategory(cat) {
    if (!cat) return '';
    return normalizeText(cat).replace(/\s+/g, '');
}

function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[أإآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .trim();
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
        const titleElement = card.querySelector('h3');
        if (titleElement) {
            const title = titleElement.textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function handleGlobalSearch(query) {
    if (!query || !query.trim()) return;
}