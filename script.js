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
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        courseCards.forEach(card => {
          const isMatch = filterValue === 'all' || card.getAttribute('data-level') === filterValue;

          if (isMatch) {
            visibleCount++;
          }

          if (isReducedMotion) {
            if (isMatch) {
              card.removeAttribute('hidden');
              card.style.display = 'flex';
              card.style.opacity = '1';
            } else {
              card.setAttribute('hidden', '');
              card.style.display = 'none';
              card.style.opacity = '0';
            }
          } else {
            if (!isMatch) {
              // Fade out
              card.style.transition = 'opacity 200ms ease, transform 0.3s ease, box-shadow 0.3s ease';
              card.style.opacity = '0';
              setTimeout(() => {
                // Ensure we don't hide if another filter click happened making it match again
                if (chip.getAttribute('aria-pressed') === 'true' && (filterValue !== 'all' && card.getAttribute('data-level') !== filterValue)) {
                  card.setAttribute('hidden', '');
                  card.style.display = 'none';
                }
              }, 200);
            } else {
              // Prepare to fade in
              card.removeAttribute('hidden');
              card.style.display = 'flex';
              // Force reflow
              void card.offsetWidth;
              card.style.transition = 'opacity 300ms ease, transform 0.3s ease, box-shadow 0.3s ease';
              card.style.opacity = '1';
            }
          }
        });

        // Update aria-live count
        filterCount.textContent = `Showing ${visibleCount} course${visibleCount !== 1 ? 's' : ''}`;
      });
    });
  }
});

  // 6. Live Page: Countdown Timer
  const countdownContainer = document.getElementById('countdown-timer');
  const countdownEndedMsg = document.getElementById('countdown-ended-msg');
  const joinBtn = document.getElementById('join-btn');

  if (countdownContainer) {
    const targetDateStr = countdownContainer.getAttribute('data-start');
    const targetDate = new Date(targetDateStr).getTime();

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    const updateDigit = (el, newVal) => {
      const formattedVal = String(newVal).padStart(2, '0');
      if (el.textContent !== formattedVal) {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!isReducedMotion) {
          // Slide in animation (only if motion allowed)
          // To safely animate without breaking layout, we transition transform momentarily
          el.style.transition = 'none';
          el.style.transform = 'translateY(-8px)';
          el.style.opacity = '0';

          requestAnimationFrame(() => {
            el.textContent = formattedVal;
            requestAnimationFrame(() => {
              el.style.transition = 'transform 200ms ease-out, opacity 200ms ease-out';
              el.style.transform = 'translateY(0)';
              el.style.opacity = '1';
            });
          });
        } else {
          el.textContent = formattedVal;
        }
      }
    };

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        // Event passed
        countdownContainer.style.display = 'none';
        if (countdownEndedMsg) countdownEndedMsg.removeAttribute('hidden');
        if (joinBtn) joinBtn.style.display = 'none';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      updateDigit(cdDays, days);
      updateDigit(cdHours, hours);
      updateDigit(cdMins, minutes);
      updateDigit(cdSecs, seconds);
    };

    // Initial call
    updateTimer();
    // Update every second
    setInterval(updateTimer, 1000);
  }

  // 7. Live Page: Add to Calendar
  const addToCalBtn = document.getElementById('add-to-calendar');
  if (addToCalBtn && countdownContainer) {
    addToCalBtn.addEventListener('click', () => {
      try {
        const targetDateStr = countdownContainer.getAttribute('data-start');
        const startDate = new Date(targetDateStr);
        const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // 60 minutes duration

        // Format date for ICS (YYYYMMDDTHHMMSSZ) - converting to UTC
        const formatDate = (date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `DTSTART:${formatDate(startDate)}`,
          `DTEND:${formatDate(endDate)}`,
          'SUMMARY:Study Planning for Term Exams: Live Q&A',
          'DESCRIPTION:A relaxed 60-minute session. Bring your questions and we will answer as many as we can.',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'live-session.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Failed to generate calendar file", e);
      }
    });
  }

  // 8. Live Page: Audience Filtering
  const audienceChips = document.querySelectorAll('#audience-filters .chip');
  const libraryCards = document.querySelectorAll('.recording-card, .guide-card');
  const audienceFilterCount = document.getElementById('audience-filter-count');

  if (audienceChips.length > 0 && libraryCards.length > 0 && audienceFilterCount) {
    audienceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        audienceChips.forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');

        const filterValue = chip.getAttribute('data-audience');
        let visibleCount = 0;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        libraryCards.forEach(card => {
          const cardAudience = card.getAttribute('data-audience');
          const isMatch = filterValue === 'all' || cardAudience === 'both' || cardAudience === filterValue;

          if (isMatch) {
            visibleCount++;
          }

          if (isReducedMotion) {
            if (isMatch) {
              card.removeAttribute('hidden');
              card.style.display = 'flex';
              card.style.opacity = '1';
            } else {
              card.setAttribute('hidden', '');
              card.style.display = 'none';
              card.style.opacity = '0';
            }
          } else {
            if (!isMatch) {
              // Note: to preserve hover transitions in style.css, we redefine only opacity/transform
              card.style.transition = 'opacity 200ms ease, transform 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease';
              card.style.opacity = '0';
              setTimeout(() => {
                // Double check if it still shouldn't match before hiding completely
                if (chip.getAttribute('aria-pressed') === 'true' &&
                    (filterValue !== 'all' && card.getAttribute('data-audience') !== 'both' && card.getAttribute('data-audience') !== filterValue)) {
                  card.setAttribute('hidden', '');
                  card.style.display = 'none';
                }
              }, 200);
            } else {
              card.removeAttribute('hidden');
              card.style.display = 'flex';
              void card.offsetWidth; // Force reflow
              card.style.transition = 'opacity 300ms ease, transform 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease';
              card.style.opacity = '1';
            }
          }
        });

        audienceFilterCount.textContent = `Showing ${visibleCount} item${visibleCount !== 1 ? 's' : ''}`;
      });
    });
  }

  // 9. Live Page: Ask a Question Form Validation
  const submitBtn = document.getElementById('submit-question');
  const askFormWrapper = document.getElementById('ask-form-wrapper');
  const askSuccess = document.getElementById('ask-success');

  if (submitBtn && askFormWrapper && askSuccess) {
    const qName = document.getElementById('q-name');
    const qQuestion = document.getElementById('q-question');
    const qError = document.getElementById('q-error');
    const qConsent = document.getElementById('q-consent');
    const consentError = document.getElementById('consent-error');

    submitBtn.addEventListener('click', () => {
      let isValid = true;

      // Validate Question
      if (!qQuestion.value.trim()) {
        qQuestion.setAttribute('aria-invalid', 'true');
        qError.removeAttribute('hidden');
        isValid = false;
      } else {
        qQuestion.setAttribute('aria-invalid', 'false');
        qError.setAttribute('hidden', '');
      }

      // Validate Consent
      if (!qConsent.checked) {
        qConsent.setAttribute('aria-invalid', 'true');
        consentError.removeAttribute('hidden');
        isValid = false;
      } else {
        qConsent.setAttribute('aria-invalid', 'false');
        consentError.setAttribute('hidden', '');
      }

      if (isValid) {
        // Success
        askFormWrapper.style.display = 'none';
        askSuccess.removeAttribute('hidden');
      }
    });

    // Character counter for textarea
    const charCount = document.getElementById('q-char-count');
    if (qQuestion && charCount) {
      qQuestion.addEventListener('input', () => {
        const length = qQuestion.value.length;
        charCount.textContent = `${length} / 500`;
        // Clear error on input
        if (length > 0) {
          qQuestion.setAttribute('aria-invalid', 'false');
          if (qError) qError.setAttribute('hidden', '');
        }
      });
    }

    // Clear consent error on change
    if (qConsent && consentError) {
      qConsent.addEventListener('change', () => {
        if (qConsent.checked) {
          qConsent.setAttribute('aria-invalid', 'false');
          consentError.setAttribute('hidden', '');
        }
      });
    }
  }
