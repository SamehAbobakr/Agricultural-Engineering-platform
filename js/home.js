function renderHome() {
currentGrade = '';
currentDept = '';
currentTerm = '';

updateSidebarActive();

const html = `
    <div class="fade-in">

        <div class="stats-grid">
            <div class="stat-card">
                <h3>44</h3>
                <p>📚 إجمالي المواد المتاحة</p>
            </div>

            <div class="stat-card">
                <h3>480</h3>
                <p>🎥 إجمالي المحاضرات</p>
            </div>

            <div class="stat-card">
                <h3>720</h3>
                <p>📄 ملفات PDF</p>
            </div>

            <div class="stat-card">
                <h3>35</h3>
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

                <div class="card-header-icon">📘</div>

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

                <div class="card-header-icon">📗</div>

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

                <div class="card-header-icon">📙</div>

                <h3>الفرقة الثالثة</h3>

                <p class="card-info">
                    بداية التخصص والتفرع للأقسام العلمية الستة.
                    <br>
                    <strong style="color:var(--primary-color)">
                        متاح: هندسة القوى والآلات (الترم الأول)
                    </strong>
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

                <div class="card-header-icon">📕</div>

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

        <div class="grid-container">

            <!-- سبورة الشرح -->
            <div class="card"
                onclick="openWhiteboard()"
                style="
                    border-top: 4px solid var(--primary-color);
                    cursor: pointer;
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

                <div class="card-footer">
                    <span>فتح السبورة</span>
                    <span>←</span>
                </div>

            </div>


          <!-- NotebookLM -->
<div class="card"
    onclick="openNotebookLM()"
    style="
        border-top: 4px solid var(--primary-color);
        cursor: pointer;
    ">

    <div class="card-header-icon">
        <img
            src="assets/images/icons/NotebookLM.jfif"
            alt="NoteBook-LM"
            style="
                width: 52px;
                height: 52px;
                object-fit: contain;
            "
        >
    </div>

    <h3>NotebookLM</h3>

    <p class="card-info">
        مساعد ذكي لفهم وتلخيص ملفات المقررات والإجابة عن أسئلتك.
    </p>

    <div class="card-footer">
        <span>فتح NotebookLM</span>
        <span>←</span>
    </div>

</div>
`;

document.getElementById('contentArea').innerHTML = html;


}


function openWhiteboard() {
const whiteboardUrl = 'https://spahboard.ninjascribe.workers.dev/';


window.open(
    whiteboardUrl,
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
