document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Scroll Reveal for Feature Cards
        const featureCards = document.querySelectorAll('.feature-card');

        // Add scroll-reveal class and staggered delay
        featureCards.forEach((card, index) => {
            card.classList.add('scroll-reveal');
            card.style.transitionDelay = `${index * 120}ms`;
        });

        // Intersection Observer for scroll reveal
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        featureCards.forEach(card => {
            observer.observe(card);
        });
    }
});
