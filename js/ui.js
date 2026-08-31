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