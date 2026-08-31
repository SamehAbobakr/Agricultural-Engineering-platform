function filterSubjects(query) {
    const cards = document.querySelectorAll(
        '#subjectsGridContainer .card'
    );

    cards.forEach(card => {
        const titleElement = card.querySelector('h3');

        if (!titleElement) return;

        const title = titleElement.textContent.toLowerCase();

        if (title.includes(query.toLowerCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}


function handleGlobalSearch(query) {
    if (!query || !query.trim()) return;
}