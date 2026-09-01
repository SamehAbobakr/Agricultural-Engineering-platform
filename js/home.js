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
                اختر الفرقة الدراسية
            </h2>

            <div class="grid-container">

                <!-- الفرقة الأولى -->
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
                "
                >

                    <h3>الفرقة الأولى</h3>

                    <p class="card-info">
                        المقررات الأساسية العامة وتأسيس العلوم الهندسية.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <!-- الفرقة الثانية -->
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
                        "
                    >

                    <h3>الفرقة الثانية</h3>

                    <p class="card-info">
                        المقررات الهندسية التأسيسية والرياضيات المتقدمة.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <!-- الفرقة الثالثة -->
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
                        "
                    >

                    <h3>الفرقة الثالثة</h3>

                    <p class="card-info">
                        بداية التخصص والتفرع للأقسام العلمية الخمسة.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
                    </div>

                </div>


                <!-- الفرقة الرابعة -->
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
                        "
                    >

                    <h3>الفرقة الرابعة</h3>

                    <p class="card-info">
                        التخصص الدقيق ومشاريع التخرج والتطبيقات الهندسية.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للفرقة</span>
                        <span>←</span>
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
