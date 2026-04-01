document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: '-100px 0px -150px 0px'
    });

    document.querySelectorAll('.timeline-item, .container').forEach(item => {
        observer.observe(item);
    });

    setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        window.scrollTo(0, 0);
    }, 500);
});
