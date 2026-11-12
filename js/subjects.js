async function renderSubjects() {
    document.getElementById('contentArea').innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p>جاري تحميل المواد من Supabase...</p>
        </div>
    `;

    const subjectsToDisplay = await loadSubjectsFromSupabase();

    let html = `
        <div class="fade-in">

            <div class="breadcrumb">

                        <span onclick="goToHistoryLevel('home')">
                            <i class="ic ic-home" aria-hidden="true"></i> الرئيسية
                        </span>

                        >

                        <span onclick="goToHistoryLevel('grade')">
                            <i class="ic ic-cap" aria-hidden="true"></i> ${escapeHtml(currentGrade)}
                        </span>

                        ${
                            currentDept
                                ? `
                                    >

                                    <span onclick="goToHistoryLevel('dept')">
                                        <i class="ic ic-building" aria-hidden="true"></i> ${escapeHtml(currentDept)}
                                    </span>
                                `
                                : ''
                        }

                        >

                        <span>
                            <i class="ic ic-book" aria-hidden="true"></i> ${escapeHtml(currentTerm)}
                        </span>

                    </div>

            <h2 class="section-title">
                المواد الدراسية
                (<span style="color:var(--primary-color)">
                    ${subjectsToDisplay.length} مواد
                </span>)
            </h2>

            <input
                type="text"
                class="inner-search"
                placeholder="🔍 ابحث عن مادة..."
                oninput="filterSubjects(this.value)"
            >

            <div
                class="grid-container"
                id="subjectsGridContainer"
            >
    `;

        if (subjectsToDisplay.length === 0) {

        html += `
            <p style="
                text-align: center;
                color: var(--text-muted);
                padding: 30px;
                grid-column: 1 / -1;
            ">
                لا توجد مواد متاحة حالياً.
            </p>
        `;

    } else {

        subjectsToDisplay.forEach(sub => {

            const subJson =
                inlineArg(sub);

            const profName =
                sub.professor || 'غير متوفر';

            const updatedText = sub.updated_at
                ? new Date(sub.updated_at).toLocaleDateString('ar-EG')
                : 'حديث';

            html += `
                <div
                    class="card"
                    onclick="openMaterialView(${subJson})"
                >

                    <div class="card-header-icon">
                        ${escapeHtml(sub.icon || '📘')}
                    </div>

                    <h3>${escapeHtml(sub.name)}</h3>

                    <p class="card-info">
                        <i class="ic ic-teacher" aria-hidden="true"></i> ${escapeHtml(profName)}
                    </p>

                    <div class="card-footer">

                        <span style="color:var(--primary-color)">
                            <i class="ic ic-circle-check" aria-hidden="true"></i> ${updatedText}
                        </span>

                        <span style="
                            font-weight:bold;
                            color:var(--secondary-color)
                        ">
                            [دخول المادة]
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

    document.getElementById('contentArea').innerHTML = html;
}