async function renderHome() {

    currentGrade = '';
    currentDept = '';
    currentTerm = '';

    updateSidebarActive();


    // =========================================
    // عرض الصفحة أولاً
    // =========================================

    const html = `
        <div class="fade-in">

            <div class="stats-grid">

                <div class="stat-card">
                    <h3 id="subjectsCount">...</h3>
                    <p>📚 إجمالي المواد المتاحة</p>
                </div>

                <div class="stat-card">
                    <h3 id="filesCount">...</h3>
                    <p>📁 إجمالي الملفات التعليمية</p>
                </div>

                <div class="stat-card">
                    <h3 id="toolsCount">...</h3>
                    <p>🛠️ الأدوات التعليمية</p>
                </div>

                <div class="stat-card">
                    <h3 id="professorsCount">...</h3>
                    <p>👨‍🏫 أعضاء هيئة التدريس</p>
                </div>

            </div>

            <h2 class="section-title">
                اختر القسم التعليمي
            </h2>

            <div class="grid-container">

                <!-- الهندسة الزراعية -->
                <div class="card"
                    onclick="selectProgram('الهندسة الزراعية')">

                    <div class="card-header-icon">
                        🌾
                    </div>

                    <h3>
                        الهندسة الزراعية
                    </h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بكلية الهندسة الزراعية.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للبرنامج</span>
                        <span>←</span>
                    </div>

                </div>


                <!-- اللاندسكيب -->
                <div class="card"
                    onclick="selectProgram('اللاندسكيب والمسطحات الخضراء')">

                    <div class="card-header-icon">
                        🌿
                    </div>

                    <h3>
                        برنامج اللاندسكيب والمسطحات الخضراء
                    </h3>

                    <p class="card-info">
                        المقررات والمحتوى التعليمي الخاص ببرنامج اللاندسكيب والمسطحات الخضراء.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للبرنامج</span>
                        <span>←</span>
                    </div>

                </div>


                <!-- المصادر الإضافية -->
                        <div class="card"
                            onclick="selectProgram('مصادر إضافية')">

                            <div class="card-header-icon">
                                📚
                            </div>

                            <h3>
                                مصادر إضافية
                            </h3>

                            <p class="card-info">
                                مصادر وكتب ومواقع ومحتوى تعليمي إضافي.
                            </p>

                            <div class="card-footer">
                                <span>عرض المصادر</span>
                                <span>←</span>
                            </div>

                        </div>
                        <!-- المزيد -->
        <div
            class="card"
            onclick="selectProgram('المزيد')"
        >
            <div class="card-header-icon">
                ➕
            </div>

            <h3>المزيد</h3>

            <p class="card-info">
                أخبار وأوائل وإعلانات
            </p>

            <div class="card-footer">
                <span style="color:var(--primary-color)">
                    📰 محتوى إضافي
                </span>

                <span style="
                    font-weight:bold;
                    color:var(--secondary-color)
                ">
                    [دخول]
                </span>
            </div>

            </div>
            </div>


            <h2 class="section-title" style="margin-top: 35px;">
                أدوات المنصة
            </h2>

            <div class="tools-grid">

                <!-- =========================
                    Obsidian
                ========================== -->

                <div class="card"
                    style="
                        border-top: 4px solid var(--primary-color);
                    ">

                    <div class="card-header-icon">

                        <img
                            src="assets/images/icons/obsidian-.png"
                            alt="Obsidian"
                            style="
                                width: 52px;
                                height: 52px;
                                object-fit: contain;
                            "
                        >

                    </div>

                    <h3>
                        Obsidian
                    </h3>

                    <p class="card-info">
                        أداة لتنظيم الملاحظات وربط الأفكار والمعلومات،
                        تساعدك على بناء قاعدة معرفة خاصة بك للمذاكرة.
                    </p>

                    <div class="tool-actions">

                        <a
                            class="tool-button"
                            href="https://www.youtube.com/watch?v=NHVXgWJiIcs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🎬 مشاهدة الشرح
                        </a>

                        <a
                            class="tool-button"
                            href="https://obsidian.md/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🌐 الموقع الرسمي
                        </a>

                    </div>

                </div>
                <!-- =========================
                    مؤقت المذاكرة
                ========================== -->

                <div class="card"
                    style="
                        border-top: 4px solid var(--primary-color);
                    ">

                    <div class="card-header-icon">

                        <img
                            src="assets/images/icons/alarm-clock.png"
                            alt="مؤقت المذاكرة"
                            style="
                                width: 52px;
                                height: 52px;
                                object-fit: contain;
                            "
                        >

                    </div>

                    <h3>
                        مؤقت المذاكرة
                    </h3>

                    <p class="card-info">
                        أداة تساعدك على تنظيم وقت المذاكرة والتركيز،
                        من خلال مؤقت بسيط وسهل الاستخدام.
                    </p>

                    <div class="tool-actions">

                        <a
                            class="tool-button"
                            href="tools/study-timer.html"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ⏱️ فتح المؤقت
                        </a>

                    </div>

                </div>


                <!-- =========================
                    NotebookLM
                ========================== -->

                <div class="card"
                    style="
                        border-top: 4px solid var(--primary-color);
                    ">

                    <div class="card-header-icon">

                        <img
                            src="assets/images/icons/NotebookLM.jfif"
                            alt="NotebookLM"
                            style="
                                width: 52px;
                                height: 52px;
                                object-fit: contain;
                            "
                        >

                    </div>

                    <h3>
                        NotebookLM
                    </h3>

                    <p class="card-info">
                        مساعد ذكي يساعدك على فهم وتلخيص المصادر والملفات
                        الدراسية والإجابة عن أسئلتك اعتمادًا على محتواها.
                    </p>

                    <div class="tool-actions">

                        <a
                            class="tool-button"
                            href="https://www.youtube.com/watch?v=YTfhgzDZZ0w"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🎬 مشاهدة الشرح
                        </a>

                        <a
                            class="tool-button"
                            href="https://notebooklm.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🌐 الموقع الرسمي
                        </a>

                    </div>

                </div>


                <!-- =========================
                    سبورة الشرح
                ========================== -->

                <div class="card"
                    style="
                        border-top: 4px solid var(--primary-color);
                    ">

                    <div class="card-header-icon">
                        🖊️
                    </div>

                    <h3>
                        سبورة الشرح
                    </h3>

                    <p class="card-info">
                        سبورة تفاعلية للشرح والمذاكرة والمحاضرات.
                    </p>

                    <div class="tool-actions">

                        <a
                            class="tool-button"
                            href="https://spahboard.ninjascribe.workers.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            فتح السبورة
                        </a>

                    </div>

                </div>

            </div>
    `;


    document.getElementById('contentArea').innerHTML = html;


    // =========================================
    // عدد الأدوات من HTML
    // =========================================

    const toolsCount = document.querySelectorAll('.tool-item').length;



    // =========================================
    // جلب الإحصائيات من Supabase
    // =========================================

    try {

        // عدد المواد
        const {
            count: subjectsCount,
            error: subjectsError
        } = await supabaseClient
            .from('subjects')
            .select('*', {
                count: 'exact',
                head: true
            });


        if (subjectsError) {
            throw subjectsError;
        }


        // عدد الملفات التعليمية
        const {
            count: filesCount,
            error: filesError
        } = await supabaseClient
            .from('material_files')
            .select('*', {
                count: 'exact',
                head: true
            });


        if (filesError) {
            throw filesError;
        }


        // جلب أسماء أعضاء هيئة التدريس
        const {
            data: professors,
            error: professorsError
        } = await supabaseClient
            .from('subjects')
            .select('professor');


        if (professorsError) {
            throw professorsError;
        }


        // حذف القيم الفارغة والتكرارات
        const uniqueProfessors = new Set(
            professors
                .map(item => item.professor)
                .filter(name => name && name.trim() !== '')
        );


        // وضع الأرقام في الصفحة
            animateCounter(
                'subjectsCount',
                subjectsCount || 0
            );

            animateCounter(
                'filesCount',
                filesCount || 0
            );

            animateCounter(
                'professorsCount',
                uniqueProfessors.size
            );

            animateCounter(
                'toolsCount',
                toolsCount
            );


    } catch (error) {

        console.error(
            'خطأ في جلب إحصائيات المنصة:',
            error
        );


        document.getElementById('subjectsCount').textContent = '—';

        document.getElementById('filesCount').textContent = '—';

        document.getElementById('professorsCount').textContent = '—';

    }

}
function openObsidian() {
    const obsidianUrl = 'https://obsidian.md/';

    window.open(
        obsidianUrl,
        '_blank',
        'noopener,noreferrer'
    );
}
function openStudyTimer() {
    window.open(
        'tools/study-timer.html',
        '_blank',
        'noopener,noreferrer'
    );
}

function openNotebookLM() {
    const notebookLMUrl = 'https://notebooklm.google.com/';

    window.open(
        notebookLMUrl,
        '_blank',
        'noopener,noreferrer'
    );
}
function openWhiteboard() {
    const whiteboardUrl = 'https://spahboard.ninjascribe.workers.dev/';

    window.open(
        whiteboardUrl,
        '_blank',
        'noopener,noreferrer'
    );
}




function animateCounter(elementId, target, duration = 1000) {

    const element = document.getElementById(elementId);

    if (!element) return;

    let start = 0;

    const startTime = performance.now();

    function updateCounter(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(
            progress * target
        );

        element.textContent = currentValue;

        if (progress < 1) {

            requestAnimationFrame(updateCounter);

        } else {

            element.textContent = target;

        }

    }

    requestAnimationFrame(updateCounter);

}
