(() => {
  'use strict';

  /* ==========================================================================
     1. APPLE-STYLE INTERACTIVE 4-SPECIALTY MAQUETTE CONTROLLER
     ========================================================================== */
  const CRAFT_KEYS = ['mobiliario', 'tapiceria', 'iluminacion', 'descanso'];

  const CRAFT_DATA = {
    mobiliario: {
      title: 'Salón contemporáneo en roble natural y nogal',
      desc: 'Sofá chaise-longue verde musgo, mesa de centro en roble y aparador ajustados a las dimensiones de tu hogar.',
      img: 'assets/slider-3.png',
      imgAlt: 'Sofá chaise-longue verde musgo en exposición Tu Kasa Confort',
      stageCaption: 'Estado 01 · Mobiliario minimalista (Sofá chaise-longue + aparador nogal + mesa roble)',
      callouts: [
        'Chaise-longue verde musgo · 295 cm',
        'Mesa orgánica en roble natural',
        'Aparador de nogal y estantería'
      ]
    },
    tapiceria: {
      title: 'Tapicería textil a medida y visillos de lino',
      desc: 'Cortinas confeccionadas con caída impecable, puf a juego y muestrario de telas antimanchas de alta resistencia.',
      img: 'assets/tapiceria-hero.png',
      imgAlt: 'Muestrario de telas y tapicería a medida en Tu Kasa Confort',
      stageCaption: 'Estado 02 · Tapicería y textil (Cortinas de lino en movimiento + puf + muestrario)',
      callouts: [
        'Cortinas de lino con caída a medida',
        'Puf tapizado y telas Aquaclean',
        'Alfombra tejida en fibra natural'
      ]
    },
    iluminacion: {
      title: 'Iluminación cálida ambiental y luz de lectura',
      desc: 'Luminarias suspendidas de cristal opal y lámpara de pie en latón para equilibrar el confort visual del salón.',
      img: 'assets/iluminacion-hero.jpg',
      imgAlt: 'Iluminación decorativa cálida en Tu Kasa Confort Motril',
      stageCaption: 'Estado 03 · Iluminación escénica (Encendido cálido de esferas opalinas y lámpara de pie)',
      callouts: [
        'Lámpara suspendida en cristal opal',
        'Luminaria de pie en latón 2700K',
        'Halos de luz cálida perimetral'
      ]
    },
    descanso: {
      title: 'Ingeniería del descanso y confort ergonómico',
      desc: 'Suspensión de muelles ensacados, acogida viscoelástica y espumación técnica para un soporte corporal óptimo.',
      img: 'assets/descanso-card.png',
      imgAlt: 'Equipos de descanso y confort ergonómico en Tu Kasa Confort',
      stageCaption: 'Estado 04 · Ingeniería del descanso (Sección explosionada de núcleo y suspensión)',
      callouts: [
        'Acogida viscoelástica adaptable',
        'Núcleo HR de alta resiliencia',
        'Bloque de muelles ensacados'
      ]
    }
  };

  const svgMaquette = document.getElementById('tukasa-atelier-iso');
  const craftBtns = document.querySelectorAll('.hero__craft-btn[data-craft]');
  const craftPanel = document.getElementById('hero-craft-panel');
  const craftTitle = document.getElementById('hero-craft-title');
  const craftDesc = document.getElementById('hero-craft-desc');
  const craftImg = document.getElementById('hero-craft-img');
  const stageCaption = document.getElementById('iso-stage-caption');
  const callout1 = document.getElementById('callout-1');
  const callout2 = document.getElementById('callout-2');
  const callout3 = document.getElementById('callout-3');
  const craftTabs = document.querySelector('.hero__craft-tabs');
  const calloutsEl = document.getElementById('iso-stage-callouts');
  let swapTimer = 0;
  const activateCraft = (key) => {
    const info = CRAFT_DATA[key];
    if (!info) return;

    // 1. Update SVG data-specialty attribute + one-shot swap pulse
    if (svgMaquette) {
      svgMaquette.setAttribute('data-specialty', key);
      svgMaquette.classList.remove('is-swapping');
      void svgMaquette.getBoundingClientRect();
      svgMaquette.classList.add('is-swapping');
    }

    // 2. Update Segmented Control pills (sliding indicator via --i)
    if (craftTabs) craftTabs.style.setProperty('--i', CRAFT_KEYS.indexOf(key));
    craftBtns.forEach((btn) => {
      const active = btn.getAttribute('data-craft') === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // 3. Fade out panel + chips, swap copy, fade back in (title above stage stays fixed)
    if (craftPanel) craftPanel.classList.add('is-switching');
    if (calloutsEl) calloutsEl.classList.add('is-switching');
    window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      if (callout1 && info.callouts[0]) callout1.textContent = info.callouts[0];
      if (callout2 && info.callouts[1]) callout2.textContent = info.callouts[1];
      if (callout3 && info.callouts[2]) callout3.textContent = info.callouts[2];
      if (craftTitle) craftTitle.textContent = info.title;
      if (craftDesc) craftDesc.textContent = info.desc;
      if (craftImg && info.img) {
        craftImg.setAttribute('src', info.img);
        craftImg.setAttribute('alt', info.imgAlt);
      }
      if (craftPanel) craftPanel.classList.remove('is-switching');
      if (calloutsEl) calloutsEl.classList.remove('is-switching');
    }, 180);
  };

  // Subtle pointer parallax on the maquette (fine pointers only)
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual && svgMaquette && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    let raf = 0;
    heroVisual.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = heroVisual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        svgMaquette.style.setProperty('--px', (x * 14).toFixed(1) + 'px');
        svgMaquette.style.setProperty('--py', (y * 10).toFixed(1) + 'px');
      });
    });
    heroVisual.addEventListener('pointerleave', () => {
      svgMaquette.style.setProperty('--px', '0px');
      svgMaquette.style.setProperty('--py', '0px');
    });
  }

  if (craftBtns.length) {
    craftBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-craft');
        if (key) activateCraft(key);
      });
    });
  }

  // Bento card "Ver en maqueta 3D" triggers
  const bentoTriggers = document.querySelectorAll('[data-trigger-craft]');
  bentoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const key = trigger.getAttribute('data-trigger-craft');
      if (!key) return;
      activateCraft(key, true);
      const heroStage = document.getElementById('tukasa-atelier-iso');
      if (heroStage) {
        heroStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

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

  /* ==========================================================================
     5. MOTRIL SHOWROOM LIVE STATUS (L-V 10:00-13:30 / 17:00-20:30, Sáb 10:00-13:30)
     ========================================================================== */
  const statusEl = document.getElementById('store-status-line');

  const updateStoreStatus = () => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('es-ES', {
        timeZone: 'Europe/Madrid',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(now);

      const map = {};
      parts.forEach((p) => { map[p.type] = p.value; });
      const hour = parseInt(map.hour || '12', 10);
      const minute = parseInt(map.minute || '0', 10);
      const mins = hour * 60 + minute;
      const dayStr = (map.weekday || '').toLowerCase();

      const isSunday = dayStr.startsWith('dom');
      const isSaturday = dayStr.startsWith('sáb') || dayStr.startsWith('sab');
      const morningOpen = mins >= 10 * 60 && mins < 13 * 60 + 30;
      const eveningOpen = !isSaturday && !isSunday && mins >= 17 * 60 && mins < 20 * 60 + 30;

      if (!isSunday && (morningOpen || eveningOpen)) {
        if (statusEl) statusEl.textContent = 'Showroom abierto ahora en Motril · Te esperamos';
      } else {
        if (statusEl) statusEl.textContent = 'Tienda en Motril · Abierto L–V (10:00–13:30 y 17:00–20:30) y Sáb (10:00–13:30)';
      }
    } catch {
      // Keep default text on fallback
    }
  };
  updateStoreStatus();
})();
