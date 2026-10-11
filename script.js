// Add 'js' class to html element for animations that only run if JS is available
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header scroll effect
  const header = document.getElementById('main-header');

  const handleScroll = () => {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check in case page is loaded already scrolled
  handleScroll();

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-links a');

  if (menuToggle && mainNav) {
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      body.classList.toggle('nav-open');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (body.classList.contains('nav-open')) {
          toggleMenu();
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) {
        toggleMenu();
        menuToggle.focus();
      }
    });
  }

  // 3. Scroll Reveal Animation using IntersectionObserver
  // Only setup observer if the user has no preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    };

    revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });

    // 4. Hero animations initial states
    // The CSS defines the starting positions, and here we trigger the transitions
    // by ensuring the layout has completed before adding an active class if needed.
    // Given the prompt rules, hero fade-in is handled purely by the initial CSS state
    // and transitions resolving when the DOM is ready since `html.js` was added instantly.
    // Wait a brief moment to allow CSS initial states to apply before the page finishes rendering
    setTimeout(() => {
      // If we wanted to add an active class to trigger the hero, we could do it here
      // However, we set the initial state in CSS (.js .hero-fade) and we just let it
      // revert by removing the custom CSS classes or managing it.
      // Alternatively, relying on the page load to just play the keyframes or transitions.

      // Let's implement hero reveal explicitly by removing the initial state classes
      const h1Lines = document.querySelectorAll('.hero .h1-line, .page-hero .h1-line');
      const heroFades = document.querySelectorAll('.hero .hero-fade, .page-hero .hero-fade');

      h1Lines.forEach((line, index) => {
        line.style.transition = `transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 100}ms`;
        line.style.transform = 'translateY(0)';
      });

      heroFades.forEach((fade, index) => {
        // Delays: Eyebrow: 0ms, Subline: 350ms, Actions: 450ms, Subactions: 550ms
        let delay = 0;
        if (index === 0) delay = 0; // eyebrow
        else if (index === 1) delay = 350; // subline
        else if (index === 2) delay = 450; // actions

        fade.style.transition = `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;
        fade.style.opacity = '1';
        fade.style.transform = 'translateY(0)';
      });

      const wavyPath = document.querySelector('.wavy-path');
      if (wavyPath) {
        wavyPath.style.transition = 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1) 700ms';
        wavyPath.style.strokeDashoffset = '0';
      }

    }, 50); // slight delay to ensure DOM is ready and CSS applied

  } else {
    // Fallback if IntersectionObserver is not supported or reduced motion preferred
    // Just reveal everything immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-revealed');
    });

    // reset hero to visible
    const h1Lines = document.querySelectorAll('.hero .h1-line, .page-hero .h1-line');
    const heroFades = document.querySelectorAll('.hero .hero-fade, .page-hero .hero-fade');
    h1Lines.forEach(line => line.style.transform = 'translateY(0)');
    heroFades.forEach(fade => {
      fade.style.opacity = '1';
      fade.style.transform = 'translateY(0)';
    });

    const wavyPath = document.querySelector('.wavy-path');
    if (wavyPath) wavyPath.style.strokeDashoffset = '0';
  }

  // 5. Course Filtering Logic
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  const courseCards = document.querySelectorAll('.course-card');
  const filterCount = document.querySelector('.filter-count');

  if (filterChips.length > 0 && courseCards.length > 0 && filterCount) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Update aria-pressed
        filterChips.forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');

        const filterValue = chip.getAttribute('data-filter');
        let visibleCount = 0;

        courseCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-level') === filterValue) {
            card.style.display = 'flex';
            visibleCount++;

            // Re-trigger reveal animation if supported
            if (card.classList.contains('reveal')) {
              card.classList.remove('is-revealed');
              // Small delay to allow display:flex to apply before adding class back
              setTimeout(() => {
                if (typeof revealObserver !== 'undefined') {
                   revealObserver.observe(card);
                } else {
                   card.classList.add('is-revealed');
                }
              }, 10);
            }
          } else {
            card.style.display = 'none';
          }
        });

        // Update aria-live count
        filterCount.textContent = `Showing ${visibleCount} course${visibleCount !== 1 ? 's' : ''}`;
      });
    });
  }
});
