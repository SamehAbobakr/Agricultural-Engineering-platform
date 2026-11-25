async function renderHome() {

    currentGrade = '';
    currentDept = '';
    currentTerm = '';

    // =========================================
    // عرض الصفحة أولاً
    // =========================================

    const html = `
        <div class="fade-in">

            <div class="stats-grid">

                <div class="stat-card">
                    <h3 id="subjectsCount">...</h3>
                    <p><i class="ic ic-library" aria-hidden="true"></i> إجمالي المواد المتاحة</p>
                </div>

                <div class="stat-card">
                    <h3 id="filesCount">...</h3>
                    <p><i class="ic ic-folder" aria-hidden="true"></i> إجمالي الملفات التعليمية</p>
                </div>

                <div class="stat-card">
                    <h3 id="professorsCount">...</h3>
                    <p><i class="ic ic-teacher" aria-hidden="true"></i> أعضاء هيئة التدريس</p>
                </div>

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
                        <i class="ic ic-cog" aria-hidden="true"></i>
                    </div>

                    <h3>
                        الهندسة الزراعية
                    </h3>

                    <p class="card-info">
                        المقررات الدراسية الخاصة بكلية الهندسة الزراعية.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للبرنامج</span>
                        <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                    </div>

                </div>


                <!-- اللاندسكيب -->
                <div class="card"
                    onclick="selectProgram('اللاندسكيب والمسطحات الخضراء')">

                    <div class="card-header-icon">
                        <i class="ic ic-leaf" aria-hidden="true"></i>
                    </div>

                    <h3>
                        برنامج اللاندسكيب والمسطحات الخضراء
                    </h3>

                    <p class="card-info">
                        المقررات والمحتوى التعليمي الخاص ببرنامج اللاندسكيب والمسطحات الخضراء.
                    </p>

                    <div class="card-footer">
                        <span>الدخول للبرنامج</span>
                        <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                    </div>

                </div>


                <!-- المصادر الإضافية -->
                        <div class="card"
                            onclick="selectProgram('مصادر إضافية')">

                            <div class="card-header-icon">
                                <i class="ic ic-globe" aria-hidden="true"></i>
                            </div>

                            <h3>
                                مصادر إضافية
                            </h3>

                            <p class="card-info">
                                مصادر وكتب ومواقع ومحتوى تعليمي إضافي.
                            </p>

                            <div class="card-footer">
                                <span>عرض المصادر</span>
                                <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                            </div>

                        </div>
                        <!-- المزيد -->
        <div
            class="card"
            onclick="selectProgram('المزيد')"
        >
            <div class="card-header-icon">
                <i class="ic ic-plus" aria-hidden="true"></i>
            </div>

            <h3>المزيد</h3>

            <p class="card-info">
                أخبار وأوائل وإعلانات
            </p>

            <div class="card-footer">
                <span style="color:var(--primary-color)">
                    <i class="ic ic-news" aria-hidden="true"></i> محتوى إضافي
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
    `;



    document.getElementById('contentArea').innerHTML = html;

 
    // =========================================
    // جلب الإحصائيات من Supabase
    // (من الـ Cache داخل js/supabase.js؛ لا طلبات جديدة عند الرجوع للرئيسية)
    // =========================================

    try {

        const stats = await loadHomeStats();

        // وضع الأرقام في الصفحة
        animateCounter(
            'subjectsCount',
            stats.subjectsCount
        );

        animateCounter(
            'filesCount',
            stats.filesCount
        );

        animateCounter(
            'professorsCount',
            stats.professorsCount
        );

    } catch (error) {

        console.error(
            'خطأ في جلب إحصائيات المنصة:',
            error
        );

        // لو غادر المستخدم الرئيسية قبل انتهاء الطلب قد لا تكون العناصر موجودة
        ['subjectsCount', 'filesCount', 'professorsCount'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '—';
        });

    }

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
