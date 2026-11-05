(() => {
  'use strict';

  /* ==========================================================================
     1. ARCHITECTURAL PARALLAX SCROLLING & MAQUETTE POINTER DEPTH
     ========================================================================== */
  const initParallax = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroVisual = document.querySelector('.hero__visual');
    const parallaxImgs = document.querySelectorAll('[data-parallax-img]');
    if (!heroVisual && !parallaxImgs.length) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 1. Hero 3D maquette stage depth lag
      if (heroVisual && scrollY < vh * 1.3) {
        const heroOffset = (scrollY * 0.12).toFixed(1);
        heroVisual.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
      }

      // 2. Contained media cards parallax shift
      parallaxImgs.forEach((img) => {
        const parent = img.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom > -40 && rect.top < vh + 40) {
          // Normalized distance from viewport center: -1 (top) to +1 (bottom)
          const centerNorm = (rect.top + rect.height * 0.5 - vh * 0.5) / (vh * 0.5);
          const shift = (centerNorm * -22).toFixed(1);
          img.style.setProperty('--parallax-shift', `${shift}px`);
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  };

  initParallax();

  // Subtle pointer depth on the maquette (desktop fine pointers only)
  const heroVisual = document.querySelector('.hero__visual');
  const svgMaquette = document.getElementById('tukasa-atelier-iso');
  if (heroVisual && svgMaquette && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    let raf = 0;
    heroVisual.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = heroVisual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        svgMaquette.style.setProperty('--px', (x * 12).toFixed(1) + 'px');
        svgMaquette.style.setProperty('--py', (y * 8).toFixed(1) + 'px');
      });
    });
    heroVisual.addEventListener('pointerleave', () => {
      svgMaquette.style.setProperty('--px', '0px');
      svgMaquette.style.setProperty('--py', '0px');
    });
  }

  /* ==========================================================================
     2. SCROLL ENTRANCE OBSERVER & NAV LINK HIGHLIGHT
     ========================================================================== */
  const progressBar = document.getElementById('header-progress');
  if (progressBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
          progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  const motionNodes = document.querySelectorAll('[data-motion]');
  if ('IntersectionObserver' in window && motionNodes.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-entering');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    motionNodes.forEach((node) => observer.observe(node));
  }

  const navLinks = document.querySelectorAll('.site-nav__link');
  const trackedSections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && trackedSections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.endsWith(`#${id}`)) {
                link.classList.add('is-current');
              } else {
                link.classList.remove('is-current');
              }
            });
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px' }
    );
    trackedSections.forEach((sec) => navObserver.observe(sec));
  }

  /* ==========================================================================
     3. INTERACTIVE PROJECT TRIPTYCH GALLERIES (Swap side image with main)
     ========================================================================== */
  const galleries = document.querySelectorAll('[data-gallery]');
  galleries.forEach((gallery) => {
    const mainFig = gallery.querySelector('.project-triptych__main');
    const mainImg = mainFig ? mainFig.querySelector('img') : null;
    const sideFigures = gallery.querySelectorAll('.project-triptych__side');
    if (!mainFig || !mainImg || !sideFigures.length) return;

    const projectBand = gallery.closest('.project-band');
    const catText = projectBand ? projectBand.querySelector('.project-meta__cat') : null;
    const scopeText = projectBand ? projectBand.querySelector('.project-meta__scope p') : null;
    const inquiryLink = projectBand ? projectBand.querySelector('.project-meta__link') : null;
    const projectName = projectBand ? projectBand.querySelector('.project-meta__name h3')?.textContent : '';

    const swapImages = (sideFig) => {
      const sideImg = sideFig.querySelector('img');
      if (!sideImg) return;

      const prevMainSrc = mainImg.getAttribute('src');
      const prevMainAlt = mainImg.getAttribute('alt');
      const prevMainCat = mainFig.getAttribute('data-cat') || '';
      const prevMainScope = mainFig.getAttribute('data-scope') || '';
      const prevMainLabel = mainFig.getAttribute('data-label') || 'imagen';

      const newMainSrc = sideImg.getAttribute('src');
      const newMainAlt = sideImg.getAttribute('alt');
      const newMainCat = sideFig.getAttribute('data-cat') || '';
      const newMainScope = sideFig.getAttribute('data-scope') || '';
      const newMainLabel = sideFig.getAttribute('data-label') || 'imagen';

      mainImg.style.opacity = '0.35';
      sideImg.style.opacity = '0.35';
      if (catText) catText.style.opacity = '0.25';
      if (scopeText) scopeText.style.opacity = '0.25';

      window.setTimeout(() => {
        // Apply new data to main figure
        mainImg.setAttribute('src', newMainSrc);
        mainImg.setAttribute('alt', newMainAlt);
        mainFig.setAttribute('data-cat', newMainCat);
        mainFig.setAttribute('data-scope', newMainScope);
        mainFig.setAttribute('data-label', newMainLabel);

        // Apply previous main data to clicked side thumbnail
        sideImg.setAttribute('src', prevMainSrc);
        sideImg.setAttribute('alt', prevMainAlt);
        sideFig.setAttribute('data-cat', prevMainCat);
        sideFig.setAttribute('data-scope', prevMainScope);
        sideFig.setAttribute('data-label', prevMainLabel);
        sideFig.setAttribute('aria-label', `Ampliar ${prevMainLabel}`);

        // Update metadata text below
        if (catText && newMainCat) {
          catText.textContent = newMainCat;
          catText.style.opacity = '1';
        }
        if (scopeText && newMainScope) {
          scopeText.textContent = newMainScope;
          scopeText.style.opacity = '1';
        }
        if (inquiryLink && projectName && newMainCat) {
          inquiryLink.setAttribute('data-inquiry', `Proyecto similar a ${projectName} (${newMainCat})`);
        }

        mainImg.style.opacity = '1';
        sideImg.style.opacity = '1';
      }, 140);
    };

    sideFigures.forEach((fig) => {
      fig.addEventListener('click', () => swapImages(fig));
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swapImages(fig);
        }
      });
    });
  });

  /* ==========================================================================
     4. DIRECT INQUIRY LINKS (MAILTO PRE-FILL)
     ========================================================================== */
  const inquiryLinks = document.querySelectorAll('[data-inquiry]');
  inquiryLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const topic = link.getAttribute('data-inquiry');
      if (topic) {
        const subject = encodeURIComponent(`Consulta: ${topic}`);
        const body = encodeURIComponent(
          `Hola equipo de Tu Kasa Confort,\n\nMe gustaría recibir asesoramiento e información sobre: ${topic}.\n\nNombre:\nTeléfono:\nCiudad:`
        );
        window.location.href = `mailto:info@tukasaconfort.com?subject=${subject}&body=${body}`;
      }
    });
  });

})();
