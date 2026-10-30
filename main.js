(() => {
  'use strict';

  /* ==========================================================================
     1. APPLE-STYLE INTERACTIVE 4-SPECIALTY MAQUETTE CONTROLLER
     ========================================================================== */
  const CRAFT_KEYS = ['mobiliario', 'tapiceria', 'iluminacion', 'descanso'];

  const CRAFT_DATA = {
    mobiliario: {
      title: 'Sofá chaise-longue verde musgo, aparador de nogal y mesa de roble',
      desc: 'Diseñamos la distribución completa de tu salón y comedor según las medidas reales de tu vivienda, combinando maderas naturales, herrajes en negro mate y líneas minimalistas.',
      img: 'assets/slider-3.png',
      imgAlt: 'Sofá chaise-longue verde musgo en exposición Tu Kasa Confort',
      stageCaption: 'Estado 01 · Mobiliario minimalista (Sofá chaise-longue + aparador nogal + mesa roble)',
      callouts: [
        'Chaise-longue verde musgo · 295 × 175 cm',
        'Aparador en nogal y mesa de roble natural',
        'Cuadro geométrico y cerámica de exposición'
      ]
    },
    tapiceria: {
      title: 'Visillos de lino en riel de latón, puf tapizado y muestrario textil',
      desc: 'Confeccionamos cortinas a medida, estores, paneles japoneses y alfombras. Además, renovamos y retapizamos tus sofás, sillones o sillas con telas antimanchas de alta resistencia.',
      img: 'assets/tapiceria-hero.png',
      imgAlt: 'Muestrario de telas y tapicería a medida en Tu Kasa Confort',
      stageCaption: 'Estado 02 · Tapicería y textil (Cortinas de lino en movimiento + puf + muestrario)',
      callouts: [
        'Cortinas de lino natural con caída a medida',
        'Puf tapizado y muestrario de tejidos Aquaclean',
        'Alfombra tejida de fibra natural 300 × 200 cm'
      ]
    },
    iluminacion: {
      title: 'Lámpara suspendida de 4 esferas opalinas y luminaria de lectura en latón',
      desc: 'Transformamos la atmósfera del salón encendiendo cada rincón con lámparas de techo esculturales, luminarias de pie regulables y luz cálida arquitectónica.',
      img: 'assets/iluminacion-hero.jpg',
      imgAlt: 'Iluminación decorativa cálida en Tu Kasa Confort Motril',
      stageCaption: 'Estado 03 · Iluminación escénica (Encendido cálido de esferas opalinas y lámpara de pie)',
      callouts: [
        'Luminaria suspendida de 4 globos en cristal opal',
        'Lámpara de pie en latón cepillado · Luz 2700K',
        'Halos de iluminación cálida ambiental y puntual'
      ]
    },
    descanso: {
      title: 'Vista explosionada: núcleo de muelles ensacados y viscoelástica de alta densidad',
      desc: 'Elevamos los asientos en la maqueta para mostrar la ingeniería interior del confort: suspensión ergonómica, espumación técnica indeformable y equipos de descanso.',
      img: 'assets/descanso-card.png',
      imgAlt: 'Equipos de descanso y confort ergonómico en Tu Kasa Confort',
      stageCaption: 'Estado 04 · Ingeniería del descanso (Sección explosionada de núcleo y suspensión)',
      callouts: [
        'Capa superior: acogida viscoelástica transpirable',
        'Núcleo central: espuma HR de alta resiliencia',
        'Base técnica: bloque de muelles ensacados'
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
  const autoplayBtn = document.getElementById('hero-autoplay-toggle');

  let currentCraftIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = true;

  const activateCraft = (key, fromUser = false) => {
    const info = CRAFT_DATA[key];
    if (!info) return;

    const idx = CRAFT_KEYS.indexOf(key);
    if (idx !== -1) currentCraftIndex = idx;

    // 1. Update SVG data-specialty attribute to trigger Apple-style spring CSS transitions
    if (svgMaquette) {
      svgMaquette.setAttribute('data-specialty', key);
    }

    // 2. Update Segmented Control pills
    craftBtns.forEach((btn) => {
      const active = btn.getAttribute('data-craft') === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // 3. Smoothly update Callout Chips & Stage Caption
    const calloutsWrap = document.querySelector('.iso-stage__callouts');
    if (calloutsWrap) calloutsWrap.classList.add('is-switching');
    if (stageCaption) stageCaption.textContent = info.stageCaption;

    // 4. Smoothly transition detail panel copy + reference photo
    if (craftPanel) craftPanel.classList.add('is-switching');
    window.setTimeout(() => {
      if (callout1 && info.callouts[0]) callout1.textContent = info.callouts[0];
      if (callout2 && info.callouts[1]) callout2.textContent = info.callouts[1];
      if (callout3 && info.callouts[2]) callout3.textContent = info.callouts[2];
      if (calloutsWrap) calloutsWrap.classList.remove('is-switching');

      if (craftTitle) craftTitle.textContent = info.title;
      if (craftDesc) craftDesc.textContent = info.desc;
      if (craftImg && info.img) {
        craftImg.setAttribute('src', info.img);
        craftImg.setAttribute('alt', info.imgAlt);
      }
      if (craftPanel) craftPanel.classList.remove('is-switching');
    }, 150);

    if (fromUser && isAutoplaying) {
      stopAutoplay();
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    isAutoplaying = true;
    if (autoplayBtn) {
      autoplayBtn.textContent = 'Pausar ciclo';
      autoplayBtn.setAttribute('aria-pressed', 'true');
    }
    autoplayTimer = window.setInterval(() => {
      const nextIndex = (currentCraftIndex + 1) % CRAFT_KEYS.length;
      activateCraft(CRAFT_KEYS[nextIndex], false);
    }, 4800);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    isAutoplaying = false;
    if (autoplayBtn) {
      autoplayBtn.textContent = 'Reanudar ciclo';
      autoplayBtn.setAttribute('aria-pressed', 'false');
    }
  };

  if (craftBtns.length) {
    craftBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-craft');
        if (key) activateCraft(key, true);
      });
    });

    // Respect prefers-reduced-motion before starting auto-cycle
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      if (isAutoplaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
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
     2. SCROLL ENTRANCE OBSERVER
     ========================================================================== */
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
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    motionNodes.forEach((node) => observer.observe(node));
  }

  /* ==========================================================================
     3. INTERACTIVE PROJECT TRIPTYCH GALLERIES (Swap side image with main)
     ========================================================================== */
  const galleries = document.querySelectorAll('[data-gallery]');
  galleries.forEach((gallery) => {
    const mainImg = gallery.querySelector('.project-triptych__main img');
    const sideFigures = gallery.querySelectorAll('.project-triptych__side');
    if (!mainImg || !sideFigures.length) return;

    const swapImages = (sideFig) => {
      const sideImg = sideFig.querySelector('img');
      if (!sideImg) return;
      const prevMainSrc = mainImg.getAttribute('src');
      const prevMainAlt = mainImg.getAttribute('alt');
      const newMainAlt = sideImg.getAttribute('alt');

      mainImg.style.opacity = '0.35';
      sideImg.style.opacity = '0.35';

      const projectBand = gallery.closest('.project-band');
      const scopeText = projectBand ? projectBand.querySelector('.project-meta__scope p') : null;
      if (scopeText) scopeText.style.opacity = '0.25';

      window.setTimeout(() => {
        mainImg.setAttribute('src', sideImg.getAttribute('src'));
        mainImg.setAttribute('alt', newMainAlt);
        sideImg.setAttribute('src', prevMainSrc);
        sideImg.setAttribute('alt', prevMainAlt);
        if (scopeText && newMainAlt) {
          scopeText.textContent = newMainAlt;
          scopeText.style.opacity = '1';
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
     4. INQUIRY PRE-FILL INTO CONTACT FORM
     ========================================================================== */
  const inquiryLinks = document.querySelectorAll('[data-inquiry]');
  const messageField = document.getElementById('f-mensaje');
  inquiryLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const topic = link.getAttribute('data-inquiry');
      if (messageField && topic) {
        messageField.value = `Hola equipo de Tu Kasa Confort, me gustaría recibir asesoramiento sobre: ${topic}. `;
        window.setTimeout(() => messageField.focus(), 450);
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

  /* ==========================================================================
     6. CONTACT FORM SUBMISSION HANDLER
     ========================================================================== */
  const contactForm = document.getElementById('tukasa-form');
  const feedbackEl = document.getElementById('form-feedback');

  if (contactForm && feedbackEl) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('f-nombre')?.value.trim() || '';
      const apellidos = document.getElementById('f-apellidos')?.value.trim() || '';
      const telefono = document.getElementById('f-telefono')?.value.trim() || '';
      const email = document.getElementById('f-email')?.value.trim() || '';
      const mensaje = document.getElementById('f-mensaje')?.value.trim() || '';

      if (!nombre || !telefono || !email || !mensaje) {
        feedbackEl.textContent = 'Por favor, completa todos los campos obligatorios para que podamos contactarte.';
        return;
      }

      const subject = encodeURIComponent(`Consulta web Tu Kasa Confort · ${nombre} ${apellidos}`.trim());
      const body = encodeURIComponent(
        `Nombre: ${nombre} ${apellidos}\nTeléfono: ${telefono}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
      );

      feedbackEl.textContent = `Gracias, ${nombre}. Hemos preparado tu consulta para info@tukasaconfort.com. También puedes llamarnos al 958 981 580.`;
      window.location.href = `mailto:info@tukasaconfort.com?subject=${subject}&body=${body}`;
    });
  }
})();
