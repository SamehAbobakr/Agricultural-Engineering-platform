function updateSidebarActive() {
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('active');
    });

    if (!currentGrade) {
        const homeEl = document.getElementById('side-home');
        if (homeEl) homeEl.classList.add('active');

    } else if (currentGrade === 'الفرقة الأولى') {
        const g1 = document.getElementById('side-g1');
        if (g1) g1.classList.add('active');

    } else if (currentGrade === 'الفرقة الثانية') {
        const g2 = document.getElementById('side-g2');
        if (g2) g2.classList.add('active');

    } else if (currentGrade === 'الفرقة الثالثة') {
        const g3 = document.getElementById('side-g3');
        if (g3) g3.classList.add('active');

    } else if (currentGrade === 'الفرقة الرابعة') {
        const g4 = document.getElementById('side-g4');
        if (g4) g4.classList.add('active');
    }
}

function toggleScrollBtn() {
    const btn = document.getElementById('scrollTopBtn');

    if (window.scrollY > 200) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
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
function renderGrades() {

    const html = `
        <div class="fade-in">

            <h2 class="section-title">
                اختر الفرقة الدراسية
            </h2>

            <div class="grid-container">

                <div class="card"
                    onclick="selectGrade('الفرقة الأولى')"
                    style="border-top: 4px solid var(--grade-1)">

                    <img
                        src="assets/images/icons/Grade1.jfif"
                        alt="الفرقة الأولى"
                        style="
                            width: 120px;
                            height: 120px;
                            object-fit: contain;
                        ">

                    <h3>الفرقة الأولى</h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بالفرقة الأولى.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <div class="card"
                    onclick="selectGrade('الفرقة الثانية')"
                    style="border-top: 4px solid var(--grade-2)">

                    <img
                        src="assets/images/icons/Grade2.jfif"
                        alt="الفرقة الثانية"
                        style="
                            width: 120px;
                            height: 120px;
                            object-fit: contain;
                        ">

                    <h3>الفرقة الثانية</h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بالفرقة الثانية.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <div class="card"
                    onclick="selectGrade('الفرقة الثالثة')"
                    style="border-top: 4px solid var(--grade-3)">

                    <img
                        src="assets/images/icons/Grade3.jfif"
                        alt="الفرقة الثالثة"
                        style="
                            width: 120px;
                            height: 120px;
                            object-fit: contain;
                        ">

                    <h3>الفرقة الثالثة</h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بالفرقة الثالثة.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <div class="card"
                    onclick="selectGrade('الفرقة الرابعة')"
                    style="border-top: 4px solid var(--grade-4)">

                    <img
                        src="assets/images/icons/Grade4.jfif"
                        alt="الفرقة الرابعة"
                        style="
                            width: 120px;
                            height: 120px;
                            object-fit: contain;
                        ">

                    <h3>الفرقة الرابعة</h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بالفرقة الرابعة.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>

            </div>

        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}
async function renderMore() {

    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري تحميل المزيد...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from('more_items')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;

        let html = `
            <div class="fade-in">

                <div class="breadcrumb">
                    <span onclick="resetView()">🏠 الرئيسية</span>
                    >
                    <span>➕ المزيد</span>
                </div>

                <h2 class="section-title">
                    المزيد
                </h2>

                <div class="grid-container">
        `;

        if (!data || data.length === 0) {

            html += `
                <p style="
                    text-align: center;
                    color: var(--text-muted);
                    padding: 30px;
                    grid-column: 1 / -1;
                ">
                    لا يوجد محتوى متاح حالياً.
                </p>
            `;

        } else {

            data.forEach(item => {

                html += `
                    <div
                        class="card"
                        onclick="openMoreItem('${item.id}')"
                    >

                        <div class="card-header-icon">
                            ${item.icon || '📌'}
                        </div>

                        <h3>${item.title}</h3>

                        <p class="card-info">
                            ${item.description || ''}
                        </p>

                        <div class="card-footer">

                            <span style="color:var(--primary-color)">
                                ${item.category || 'محتوى إضافي'}
                            </span>

                            <span style="
                                font-weight:bold;
                                color:var(--secondary-color)
                            ">
                                [دخول]
                            </span>

                        </div>

                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {

        console.error('❌ خطأ في تحميل المزيد:', error);

        contentArea.innerHTML = `
            <div class="fade-in">
                <p style="
                    text-align:center;
                    color:red;
                    padding:30px;
                ">
                    حدث خطأ أثناء تحميل المحتوى.
                </p>
            </div>
        `;
    }
}
async function renderTopYears() {

    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري تحميل سنوات الأوائل...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from('top_years')
            .select('*')
            .order('year', { ascending: false });

        if (error) throw error;

        let html = `
            <div class="fade-in">

                <div class="breadcrumb">
                    <span onclick="resetView()">🏠 الرئيسية</span>
                    >
                    <span onclick="selectProgram('المزيد')">
                        ➕ المزيد
                    </span>
                    >
                    <span>🏆 الأوائل</span>
                </div>

                <h2 class="section-title">
                    🏆 الأوائل
                </h2>

                <div class="grid-container">
        `;

        if (!data || data.length === 0) {

            html += `
                <p style="
                    text-align:center;
                    color:var(--text-muted);
                    padding:30px;
                    grid-column:1 / -1;
                ">
                    لا توجد سنوات متاحة حالياً.
                </p>
            `;

        } else {

            data.forEach(item => {

                const itemJson =
                    JSON.stringify(item).replace(/"/g, '&quot;');

                html += `
                    <div
                        class="card"
                        onclick="openTopYear(${itemJson})"
                    >

                        <div class="card-header-icon">
                            🏆
                        </div>

                        <h3>
                            ${item.title}
                        </h3>

                        <p class="card-info">
                            أوائل العام ${item.year}
                        </p>

                        <div class="card-footer">

                            <span style="color:var(--primary-color)">
                                📄 PDF
                            </span>

                            <span style="
                                font-weight:bold;
                                color:var(--secondary-color)
                            ">
                                [فتح]
                            </span>

                        </div>

                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {

        console.error(
            '❌ خطأ في تحميل سنوات الأوائل:',
            error
        );

        contentArea.innerHTML = `
            <div class="fade-in">
                <p style="
                    text-align:center;
                    color:red;
                    padding:30px;
                ">
                    حدث خطأ أثناء تحميل سنوات الأوائل.
                </p>
            </div>
        `;
    }
}
async function openTopYear(item) {

    if (!item || !item.pdf_url) {
        alert("رابط ملف الـ PDF غير متوفر.");
        return;
    }

    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="fade-in material-view" style="direction: rtl; text-align: right;">

            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span>
                >
                <span onclick="selectProgram('المزيد')">
                    ➕ المزيد
                </span>
                >
                <span onclick="renderTopYears()">
                    🏆 الأوائل
                </span>
                >
                <span>${item.title}</span>
            </div>

            <h2 class="section-title" style="margin-top:10px;">
                🏆 ${item.title}
            </h2>

            <p style="
                color:var(--text-muted);
                margin-bottom:25px;
                text-align:center;
            ">
                أوائل العام ${item.year}
            </p>

            <div class="material-file-card">

                <div class="material-file-top">

                    <div class="material-file-icon">
                        📕
                    </div>

                    <h3 class="material-file-title">
                        ${item.title}
                    </h3>

                </div>

                <p class="material-file-description">
                    ملف أوائل العام ${item.year}
                </p>

                <div class="material-file-info">

                    <span>
                        📄 PDF
                    </span>

                    <span>
                        أوائل الطلاب
                    </span>

                </div>

                <div class="material-file-actions">

                    <!-- فتح الملف -->
                    <a
                        href="${item.pdf_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="material-open-btn"
                    >
                        <span>👁️</span>
                        <span>فتح الملف</span>
                    </a>

                    <!-- تحميل الملف -->
                    <button
                        type="button"
                        class="material-download-btn"
                        onclick="downloadMaterialFile(
                            '${item.pdf_url.replace(/'/g, "\\'")}',
                            '${item.title.replace(/'/g, "\\'")}'
                        )"
                    >
                        <span>⬇️</span>
                        <span>تحميل الملف</span>
                    </button>

                </div>

            </div>

        </div>
    `;
}
async function openMoreItem(id) {

    try {

        // جلب القسم الرئيسي
        const { data, error } = await supabaseClient
            .from('more_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            console.error('❌ لم يتم العثور على العنصر');
            return;
        }

        console.log("📂 القسم المختار:", data);
        console.log("🆔 ID القسم:", data.id);


        // =========================================
        // حفظ القسم الحالي في سجل التنقل
        // =========================================

        navigationHistory.push({
            program: 'المزيد',
            grade: '',
            dept: '',
            term: '',
            subject: null,

            // بيانات القسم الحالي
            moreItemId: data.id,
            moreItemTitle: data.title
        });

        navigationIndex = navigationHistory.length - 1;

        updateNavigationButtons();


        // =========================================
        // البحث عن المحتوى التابع لهذا القسم
        // =========================================

        const { data: items, error: itemsError } = await supabaseClient
            .from('top_years')
            .select('*')
            .eq('more_item_id', data.id)
            .order('year', { ascending: false });

        if (itemsError) throw itemsError;


        console.log("📦 المحتوى المرتبط بالقسم:", items);


        // =========================================
        // لو فيه كروت تابعة للقسم
        // =========================================

        if (items && items.length > 0) {

            renderMoreItemContents(data, items);

            return;
        }


        // =========================================
        // لو مفيش محتوى تابع
        // =========================================

        document.getElementById('contentArea').innerHTML = `
            <div class="fade-in">

                <div class="breadcrumb">

                    <span onclick="resetView()">
                        🏠 الرئيسية
                    </span>

                    >

                    <span onclick="selectProgram('المزيد')">
                        ➕ المزيد
                    </span>

                    >

                    <span>
                        ${data.title}
                    </span>

                </div>


                <div class="material-view">

                    <div class="card-header-icon">
                        ${data.icon || '📌'}
                    </div>

                    <h2 class="section-title">
                        ${data.title}
                    </h2>

                    ${
                        data.description
                        ? `
                            <p style="
                                text-align:center;
                                color:var(--text-muted);
                                margin:20px 0;
                            ">
                                ${data.description}
                            </p>
                        `
                        : ''
                    }


                    <p style="
                        text-align:center;
                        color:var(--text-muted);
                        padding:30px;
                    ">
                        لا يوجد محتوى متاح حالياً.
                    </p>


                    ${
                        data.link
                        ? `
                            <div style="
                                text-align:center;
                                margin-top:30px;
                            ">
                                <a
                                    href="${data.link}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn"
                                >
                                    🔗 فتح المحتوى
                                </a>
                            </div>
                        `
                        : ''
                    }

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            '❌ خطأ في فتح عنصر المزيد:',
            error
        );

    }
}
function renderMoreItemContents(parentItem, items) {

    const contentArea = document.getElementById('contentArea');

    let html = `
        <div class="fade-in">

            <div class="breadcrumb">

                <span onclick="resetView()">
                    🏠 الرئيسية
                </span>

                >

                <span onclick="selectProgram('المزيد')">
                    ➕ المزيد
                </span>

                >

                <span>
                    ${parentItem.icon || '📌'}
                    ${parentItem.title}
                </span>

            </div>


            <h2 class="section-title">
                ${parentItem.icon || '📌'}
                ${parentItem.title}
            </h2>


            <div class="grid-container">
    `;


    items.forEach(item => {

        html += `
            <div
                class="card"
                onclick="openTopYear(${JSON.stringify(item).replace(/"/g, '&quot;')})"
            >

                <div class="card-header-icon">
                    ${parentItem.icon || '📄'}
                </div>

                <h3>
                    ${item.title}
                </h3>

                <p class="card-info">
                    ${item.year ? `العام ${item.year}` : ''}
                </p>

                <div class="card-footer">

                    <span style="color:var(--primary-color)">
                        📄 PDF
                    </span>

                    <span style="
                        font-weight:bold;
                        color:var(--secondary-color)
                    ">
                        [فتح]
                    </span>

                </div>

            </div>
        `;
    });


    html += `
            </div>
        </div>
    `;

    contentArea.innerHTML = html;
}
async function renderAdditionalResources() {

    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner">⚙️</div>
            <p>جاري تحميل المصادر الإضافية...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from('additional_resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        let html = `
            <div class="fade-in">

                <div class="breadcrumb">
                    <span onclick="resetView()">🏠 الرئيسية</span>
                    >
                    <span>📚 مصادر إضافية</span>
                </div>

                <h2 class="section-title">
                    مصادر إضافية
                </h2>

                <div class="grid-container">
        `;

        if (!data || data.length === 0) {

            html += `
                <p style="
                    text-align: center;
                    color: var(--text-muted);
                    padding: 30px;
                    grid-column: 1 / -1;
                ">
                    لا توجد مصادر متاحة حالياً.
                </p>
            `;

        } else {

            data.forEach(item => {

                html += `
                    <div
                        class="card"
                        onclick="openAdditionalResource('${item.id}')"
                    >

                        <div class="card-header-icon">
                            ${item.icon || '📚'}
                        </div>

                        <h3>${item.title}</h3>

                        <p class="card-info">
                            ${item.description || ''}
                        </p>

                        <div class="card-footer">

                            <span style="color:var(--primary-color)">
                                ${item.category || 'مصدر إضافي'}
                            </span>

                            <span style="
                                font-weight:bold;
                                color:var(--secondary-color)
                            ">
                                [دخول]
                            </span>

                        </div>

                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {

        console.error(
            '❌ خطأ في تحميل المصادر الإضافية:',
            error
        );

        contentArea.innerHTML = `
            <div class="fade-in">
                <p style="
                    text-align:center;
                    color:red;
                    padding:30px;
                ">
                    حدث خطأ أثناء تحميل المصادر الإضافية.
                </p>
            </div>
        `;
    }
}
async function openAdditionalResource(id) {

    try {

        const { data, error } = await supabaseClient
            .from('additional_resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            console.error('❌ لم يتم العثور على المصدر');
            return;
        }

        document.getElementById('contentArea').innerHTML = `
            <div class="fade-in">

                <div class="breadcrumb">
                    <span onclick="resetView()">🏠 الرئيسية</span>
                    >
                    <span onclick="selectProgram('مصادر إضافية')">
                        📚 مصادر إضافية
                    </span>
                    >
                    <span>${data.title}</span>
                </div>

                <div class="material-view">

                    <div class="card-header-icon">
                        ${data.icon || '📚'}
                    </div>

                    <h2 class="section-title">
                        ${data.title}
                    </h2>

                    ${
                        data.description
                        ? `
                            <p style="
                                text-align:center;
                                color:var(--text-muted);
                                margin:20px 0;
                            ">
                                ${data.description}
                            </p>
                        `
                        : ''
                    }

                    ${
                        data.link
                        ? `
                            <div style="
                                text-align:center;
                                margin-top:30px;
                            ">
                                <a
                                    href="${data.link}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn"
                                >
                                    🔗 فتح المصدر
                                </a>
                            </div>
                        `
                        : ''
                    }

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            '❌ خطأ في فتح المصدر الإضافي:',
            error
        );

    }
}