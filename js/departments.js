function renderDepartments() {
    let html = `
        <div class="fade-in">
            <div class="breadcrumb">
                <span onclick="resetView()">🏠 الرئيسية</span> >  
                <span>🎓 ${currentGrade}</span>
            </div>

            <h2 class="section-title">
                اختر القسم العلمي (${currentGrade})
            </h2>

            <div class="grid-container">
    `;

    departmentsList.forEach(dept => {
        html += `
            <div class="card" onclick="selectDepartment('${dept.name}')">
                <div class="card-header-icon">${dept.icon}</div>

                <h3>${dept.name}</h3>

                <p class="card-info">
                    ${dept.desc}
                </p>

                <div class="card-footer">
                    <span>استعراض المواد</span>
                    <span>←</span>
                </div>
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

                <span onclick="selectGrade('${currentGrade}')">
                    🎓 ${currentGrade}
                </span>

                ${currentDept
                    ? ` > <span onclick="renderDepartments()">🏢 ${currentDept}</span>`
                    : ''
                }
            </div>

            <h2 class="section-title">اختر الفصل الدراسي</h2>

            <div class="grid-container">

                <div class="card" onclick="selectTerm('الترم الأول')">
                    <div class="card-header-icon">📖</div>

                    <h3>الترم الأول</h3>

                    <p class="card-info">
                        مقررات ومحاضرات الفصل الدراسي الأول
                    </p>

                    <div class="card-footer">
                        <span>عرض المواد</span>
                        <span>←</span>
                    </div>
                </div>

                <div class="card" onclick="selectTerm('الترم الثاني')">
                    <div class="card-header-icon">📘</div>

                    <h3>الترم الثاني</h3>

                    <p class="card-info">
                        مقررات ومحاضرات الفصل الدراسي الثاني
                    </p>

                    <div class="card-footer">
                        <span>عرض المواد</span>
                        <span>←</span>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}