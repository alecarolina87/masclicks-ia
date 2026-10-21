/* MasClicks IA · comportamiento compartido de las landings para clínicas.
   Cada página define en <body data-page="web|contenido"> de dónde viene el contacto. */
(() => {
  const WA_NUMERO = '34624834025';
  const PAGE = document.body.dataset.page || 'web';

  /* ── Medición ─────────────────────────────────────────────
     Envía el evento a GA4 y al Pixel de Meta si están cargados.
     Sin IDs configurados no hace nada (y no rompe nada). */
  const track = (event, params = {}) => {
    const data = { page: PAGE, ...params };
    if (window.gtag) window.gtag('event', event, data);
    if (window.fbq) {
      if (event === 'generate_lead') window.fbq('track', 'Lead', data);
      else window.fbq('trackCustom', event, data);
    }
  };

  /* ── WhatsApp ── */
  const waLink = msg => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.waMsg || 'Hola, quiero información sobre MasClicks IA.');
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', () => track('whatsapp_click', { place: a.dataset.track || 'wa' }));
  });

  document.querySelectorAll('[data-track]:not([data-wa])').forEach(el => {
    el.addEventListener('click', () => track('cta_click', { place: el.dataset.track }));
  });

  /* ── Botón de un plan: deja ese plan elegido en el formulario ── */
  document.querySelectorAll('[data-plan]').forEach(el => {
    el.addEventListener('click', () => {
      const sel = document.getElementById('interes');
      if (sel) sel.value = el.dataset.plan;
    });
  });

  /* ── Nav con borde al hacer scroll ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Reels: el vídeo solo se descarga al pulsar play ── */
  const reels = [...document.querySelectorAll('.reel')];
  const stopOthers = current => reels.forEach(r => {
    if (r === current) return;
    const v = r.querySelector('video');
    if (v && !v.paused) { v.pause(); r.classList.remove('is-playing'); }
  });

  reels.forEach(reel => {
    const btn = reel.querySelector('.reel__play');
    if (!btn) return;
    btn.addEventListener('click', () => {
      let v = reel.querySelector('video');
      if (!v) {
        v = document.createElement('video');
        v.src = reel.dataset.src;
        v.poster = reel.dataset.poster || '';
        v.playsInline = true;
        v.controls = true;
        v.preload = 'auto';
        v.addEventListener('ended', () => reel.classList.remove('is-playing'));
        (reel.querySelector('.phone__screen') || reel).appendChild(v);
      }
      stopOthers(reel);
      reel.classList.add('is-playing');
      v.play().catch(() => {});
      track('reel_play', { reel: reel.dataset.name || '' });
    });
  });

  /* ── Vídeo de fondo del hero: horizontal en ordenador, vertical en móvil.
     Con "reducir movimiento" activado se queda la imagen fija. ── */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    const mob = matchMedia('(max-width: 900px)').matches;
    heroVideo.poster = mob ? heroVideo.dataset.mobPoster : heroVideo.dataset.deskPoster;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.src = mob ? heroVideo.dataset.mob : heroVideo.dataset.desk;
      heroVideo.play().catch(() => {});
    }
  }

  /* ── Vídeos de mockup: en bucle y sin sonido, solo cuando se ven ── */
  const loops = document.querySelectorAll('video[data-autoplay]');
  if ('IntersectionObserver' in window && loops.length) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else v.pause();
    }), { threshold: .35 });
    loops.forEach(v => io.observe(v));
  }

  /* ── Aparición suave ── */
  const toReveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    toReveal.forEach(el => io.observe(el));
  } else toReveal.forEach(el => el.classList.add('is-in'));

  /* ── Formulario: arma el mensaje y abre WhatsApp ── */
  const card = document.querySelector('.form');
  const form = card && card.querySelector('form');
  if (form) {
    const rules = {
      nombre: v => v.trim().length >= 2,
      clinica: v => v.trim().length >= 2,
      interes: v => v.trim().length > 0,
    };
    const mark = (input, bad) => {
      input.closest('.field').classList.toggle('bad', bad);
      input.setAttribute('aria-invalid', String(bad));
    };
    Object.keys(rules).forEach(id => {
      const input = form.elements[id];
      input.addEventListener('blur', () => mark(input, !rules[id](input.value)));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('bad')) mark(input, !rules[id](input.value));
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(rules).forEach(id => {
        const input = form.elements[id];
        const bad = !rules[id](input.value);
        mark(input, bad);
        if (bad && !firstBad) firstBad = input;
      });
      const consent = form.elements.consent;
      if (!consent.checked && !firstBad) firstBad = consent;
      if (firstBad) { firstBad.focus(); return; }

      const f = form.elements;
      const lineas = [
        form.dataset.intro || 'Hola, quiero información.',
        '',
        `Nombre: ${f.nombre.value.trim()}`,
        `${form.dataset.orgLabel || 'Clínica'}: ${f.clinica.value.trim()}`,
        f.ciudad.value.trim() ? `Ciudad: ${f.ciudad.value.trim()}` : '',
        `Me interesa: ${f.interes.value}`,
        '',
        `Origen: ${form.dataset.origin || ('landing ' + PAGE)}`,
      ].filter((l, i, a) => l !== '' || a[i - 1] !== '');

      track('generate_lead', { interes: f.interes.value });
      const enlace = waLink(lineas.join('\n'));
      const ventana = window.open(enlace, '_blank', 'noopener');
      card.querySelector('[data-done-link]').href = enlace;
      card.classList.add('is-sent');
      if (!ventana) card.querySelector('[data-done-blocked]').hidden = false;
    });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
