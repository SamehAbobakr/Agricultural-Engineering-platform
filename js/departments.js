function renderDepartments() {

    let html = `
        <div class="fade-in">

            <div class="breadcrumb">

                <span onclick="goToHistoryLevel('home')">
                    <i class="ic ic-home" aria-hidden="true"></i> الرئيسية
                </span>

                >

                <span>
                    <i class="ic ic-cap" aria-hidden="true"></i> ${escapeHtml(currentGrade)}
                </span>

            </div>

            <h2 class="section-title">
                اختر القسم العلمي (${escapeHtml(currentGrade)})
            </h2>

            <div class="grid-container">
    `;

    departmentsList.forEach(dept => {

        const deptNameJson =
            inlineArg(dept.name);

        html += `
            <div
                class="card"
                onclick="selectDepartment(${deptNameJson})"
            >

                <div class="card-header-icon">
                    ${dept.icon}
                </div>

                <h3>${escapeHtml(dept.name)}</h3>

                <p class="card-info">
                    ${escapeHtml(dept.desc)}
                </p>

                <div class="card-footer">
                    <span>استعراض المواد</span>
                    <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                </div>

            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}


function renderTerms() {

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

            </div>

            <h2 class="section-title">
                اختر الفصل الدراسي
            </h2>

            <div class="grid-container">

                <div
                    class="card"
                    onclick="selectTerm('الترم الأول')"
                >

                    <div class="card-header-icon">
                        <i class="ic ic-book" aria-hidden="true"></i>
                    </div>

                    <h3>الترم الأول</h3>

                    <p class="card-info">
                        مقررات ومحاضرات الفصل الدراسي الأول
                    </p>

                    <div class="card-footer">
                        <span>عرض المواد</span>
                        <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                    </div>

                </div>


                <div
                    class="card"
                    onclick="selectTerm('الترم الثاني')"
                >

                    <div class="card-header-icon">
                        <i class="ic ic-book" aria-hidden="true"></i>
                    </div>

                    <h3>الترم الثاني</h3>

                    <p class="card-info">
                        مقررات ومحاضرات الفصل الدراسي الثاني
                    </p>

                    <div class="card-footer">
                        <span>عرض المواد</span>
                        <span><i class="ic ic-arrow" aria-hidden="true"></i></span>
                    </div>

                </div>

            </div>

        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}