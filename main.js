import Chart from 'chart.js/auto';

const chapters = {
    kap1: 'bog/kapitler/kap1_skat.md',
    kap2: 'bog/kapitler/kap2_optimering.md',
    kap3: 'bog/kapitler/kap3_kredit.md',
    kap4: 'bog/kapitler/kap4_etik.md',
    kap5: 'bog/kapitler/kap5_bolig.md',
    kap6: 'bog/kapitler/kap6_boligfin.md',
};

async function loadChapter(id) {
    const contentArea = document.getElementById('chapter-content');
    const path = chapters[id];

    if (!path) return;

    const response = await fetch(path);
    if (response.ok) {
        const text = await response.text();
        contentArea.innerHTML = convertMarkdownToHTML(text);
        generateTOC(text, id);
        renderCharts(id);
        window.scrollTo(0, 0);
    } else {
        contentArea.innerHTML = `<h2>Fejl ved indlæsning af ${id}</h2>`;
    }

    // Update active link
    document.querySelectorAll('#sidebar-nav a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
    });
}

function generateTOC(md, activeChapterId) {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';

    const chapterOrder = ['kap1', 'kap2', 'kap3', 'kap4', 'kap5', 'kap6'];
    const chapterTitles = {
        kap1: '1. Skat 2026',
        kap2: '2. Optimering',
        kap3: '3. Kredit',
        kap4: '4. Etik',
        kap5: '5. Bolig',
        kap6: '6. Finansiering'
    };

    chapterOrder.forEach(id => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = chapterTitles[id];
        if (id === activeChapterId) a.classList.add('active');
        li.appendChild(a);

        if (id === activeChapterId) {
            const subUl = document.createElement('ul');
            subUl.className = 'sub-nav';

            // Extract ## headings
            const lines = md.split('\n');
            let sectionCount = 0;
            lines.forEach(line => {
                if (line.startsWith('## ')) {
                    sectionCount++;
                    const title = line.replace('## ', '').trim();
                    const sectionId = 'section-' + sectionCount;

                    // Add ID to heading in content
                    const headings = document.querySelectorAll('h2');
                    if (headings[sectionCount - 1]) {
                        headings[sectionCount - 1].id = sectionId;
                    }

                    const subLi = document.createElement('li');
                    const subA = document.createElement('a');
                    subA.href = `#${id}/${sectionId}`;
                    subA.textContent = `${activeChapterId.replace('kap', '')}.${sectionCount} ${title}`;
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
                    });
                    subLi.appendChild(subA);
                    subUl.appendChild(subLi);
                }
            });
            li.appendChild(subUl);
        }
        chaptersList.appendChild(li);
    });
}

function convertMarkdownToHTML(md) {
    // Advanced conversion for depth and professional look
    return md
        .replace(/^# (.*$)/gim, '<h1 class="chapter-title">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="section-title">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="subsection-title">$1</h3>')
        .replace(/^\- (.*$)/gim, '<li class="list-item">$1</li>')
        .replace(/\n\n/gim, '<p class="content-p"></p>')
        .replace(/\*\*([^*]*)\*\*/gim, '<strong class="highlight">$1</strong>')
        .replace(/\*([^*]*)\*/gim, '<em class="italic">$1</em>')
        .replace(/> \[!IMPORTANT\]\n> (.*$)/gim, '<div class="callout info"><strong>VIGTIGT:</strong> $1</div>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<figure class="content-figure"><img src="$2" alt="$1"><figcaption>$1</figcaption></figure>')
        .replace(/\| (.*) \|/gim, (match) => {
            // Basic table conversion (very simplified)
            if (match.includes('---')) return '';
            return '<div class="table-container"><table>' + match.split('|').filter(s => s.trim()).map(s => `<td>${s.trim()}</td>`).join('') + '</table></div>';
        })
        .replace(/<span class="term" data-tooltip="(.*?)">(.*?)<\/span>/gim, '<span class="term" data-tooltip="$1">$2</span>');
}

function renderCharts(chapterId) {
    const existingCanvas = document.querySelectorAll('canvas');
    existingCanvas.forEach(c => c.remove());

    const contentArea = document.getElementById('chapter-content');

    if (chapterId === 'kap1') {
        const charContainer = document.createElement('div');
        charContainer.className = 'chart-wrapper';
        const ctx = document.createElement('canvas');
        charContainer.appendChild(ctx);
        contentArea.appendChild(charContainer);

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 140, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 140, 255, 0.2)');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Lavindkomst', 'Middelindkomst', "Mads' gruppe", 'Top 1%'],
                datasets: [{
                    label: 'Skattetryk (%)',
                    data: [32, 36, 41, 52],
                    backgroundColor: gradient,
                    borderColor: '#008cff',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: '#008cff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Skattetryk fordelt på indkomstgrupper (2026)',
                        font: { size: 18, family: 'Source Sans Pro' },
                        color: '#2c3e50'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { color: '#7f8c8d' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#7f8c8d' }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    } else if (chapterId === 'kap5') {
        const charContainer = document.createElement('div');
        charContainer.className = 'chart-wrapper';
        const ctx = document.createElement('canvas');
        charContainer.appendChild(ctx);
        contentArea.appendChild(charContainer);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ejerudgift (Drift)', 'Boligskat', 'Vedligehold'],
                datasets: [{
                    data: [3400, 2100, 1500],
                    backgroundColor: ['#2c3e50', '#008cff', '#bdc3c7'],
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Budgetfordeling for Parcelhus',
                        font: { size: 18, family: 'Source Sans Pro' }
                    }
                },
                cutout: '70%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    } else if (chapterId === 'kap3') {
        const charContainer = document.createElement('div');
        charContainer.className = 'chart-wrapper';
        const ctx = document.createElement('canvas');
        charContainer.appendChild(ctx);
        contentArea.appendChild(charContainer);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2015', '2017', '2019', '2021', '2023', '2025'],
                datasets: [{
                    label: 'Gennemsnitlig Gældsfaktor (DK)',
                    data: [2.8, 3.1, 3.2, 3.5, 3.3, 3.1],
                    borderColor: '#008cff',
                    backgroundColor: 'rgba(0, 140, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Udvikling i husholdningernes gældsfaktor',
                        font: { size: 18, family: 'Source Sans Pro' }
                    }
                }
            }
        });
    } else if (chapterId === 'kap4') {
        const charContainer = document.createElement('div');
        charContainer.className = 'chart-wrapper';
        const ctx = document.createElement('canvas');
        charContainer.appendChild(ctx);
        contentArea.appendChild(charContainer);

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Miljø (E)', 'Social (S)', 'Ledelse (G)', 'Afkast', 'Sikkerhed'],
                datasets: [{
                    label: 'Kundens præferencer (Case: Erik)',
                    data: [80, 40, 60, 20, 95],
                    backgroundColor: 'rgba(0, 140, 255, 0.2)',
                    borderColor: '#008cff',
                    pointBackgroundColor: '#008cff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'ESG- og Risikoprofil (Radar)'
                    }
                }
            }
        });
    } else if (chapterId === 'kap6') {
        const charContainer = document.createElement('div');
        charContainer.className = 'chart-wrapper';
        const ctx = document.createElement('canvas');
        charContainer.appendChild(ctx);
        contentArea.appendChild(charContainer);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Uge 1', 'Uge 2', 'Uge 3', 'Uge 4', 'Uge 5'],
                datasets: [{
                    label: 'Fast Rente (4%)',
                    data: [100, 99.5, 100.2, 98.5, 99.0],
                    borderColor: '#2c3e50',
                }, {
                    label: 'F-kort (Market)',
                    data: [100, 100.5, 101.5, 102.0, 101.8],
                    borderColor: '#008cff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Kursudvikling og Rentefølsomhed'
                    }
                }
            }
        });
    }
}

// Initial load based on hash
window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    loadChapter(id);
});

// Load default or hash
const initialId = window.location.hash.replace('#', '') || 'kap1';
loadChapter(initialId);
