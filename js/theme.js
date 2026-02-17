document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Check localStorage, default to 'dark' if not set
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            const newTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
        });
    }

    // Interactive Table Rows (optional JS enhancement)
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => row.classList.add('active-row'));
        row.addEventListener('mouseleave', () => row.classList.remove('active-row'));
    });
});
