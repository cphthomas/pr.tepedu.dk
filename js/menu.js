// Menu configuration for "Privatøkonomisk Rådgivning"
const menuItems = [
    { href: 'index.html', text: '0. Forside' },
    { href: 'kapitel1.html', text: '1. Skattesystemet 2026' },
    { href: 'kapitel2.html', text: '2. Kreditvurdering & Gæld' },
    { href: 'kapitel3.html', text: '3. MiFID II, Etik & ESG' },
    { href: 'kapitel4.html', text: '4. Bolighandlen & Ejendomsskat' },
    { href: 'kapitel5.html', text: '5. Realkredit & Finansiering' },
    { href: 'ordliste.html', text: '9. Ordliste' }
];

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const menuContainer = document.querySelector('.dropdown-menu');
    if (menuContainer) {
        menuContainer.innerHTML = menuItems.map(item =>
            `<a class="dropdown-item" href="${item.href}">${item.text}</a>`
        ).join('');
    }

    // Dynamic Navigation Arrows
    const pages = menuItems.map(item => item.href);

    // Get current filename more reliably
    let path = window.location.pathname.toLowerCase();
    let currentPage = 'index.html';

    if (path.includes('ordliste.html')) {
        currentPage = 'ordliste.html';
    } else {
        let match = path.match(/kapitel\d+\.html/);
        if (match) currentPage = match[0];
    }

    const currentIndex = pages.findIndex(page => page.toLowerCase() === currentPage);

    const prevLink = document.getElementById('prev-page-link');
    const nextLink = document.getElementById('next-page-link');

    if (currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
        const nextIndex = (currentIndex + 1) % pages.length;

        const prevHref = pages[prevIndex];
        const nextHref = pages[nextIndex];

        if (prevLink) {
            prevLink.href = prevHref;
            // Force navigation on click to bypass any interference
            prevLink.addEventListener('click', (e) => {
                if (e.button === 0) { // Left click only
                    window.location.href = prevHref;
                }
            });
        }
        if (nextLink) {
            nextLink.href = nextHref;
            nextLink.addEventListener('click', (e) => {
                if (e.button === 0) {
                    window.location.href = nextHref;
                }
            });
        }
    } else {
        // Fallback for untracked pages
        if (prevLink) prevLink.href = 'ordliste.html';
        if (nextLink) nextLink.href = 'kapitel1.html';
    }
});
