// Menu configuration for "Privatøkonomisk Rådgivning"
const menuItems = [
    { href: 'index.html', text: '0. Forside' },
    { href: 'kapitel1.html', text: '1. Skattesystemet 2026' },
    { href: 'kapitel2.html', text: '2. Optimering & Adfærdsøkonomi' },
    { href: 'kapitel3.html', text: '3. Kreditvurdering & Gæld' },
    { href: 'kapitel4.html', text: '4. MiFID II, Etik & ESG' },
    { href: 'kapitel5.html', text: '5. Bolighandlen & Ejendomsskat' },
    { href: 'kapitel6.html', text: '6. Realkredit & Finansiering' },
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
});
