/* ===============================
   A14 Studio — app.js
   - Header elevado + altura dinámica (--header-h)
   - Menú mobile accesible (+ bloqueo de scroll)
   - Filtros del portfolio
   - Animaciones on-scroll
   - Foco tras anchors
   - Reemplazo centralizado de WhatsApp
=================================*/

// ===== Header elevación =====
const header = document.querySelector('.site-header');
const nav = document.getElementById('nav');
const toggleBtn = document.querySelector('.nav-toggle');

function elevateOnScroll() {
  if (!header) return;
  const y = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('is-elevated', y > 6);
}
elevateOnScroll();
window.addEventListener('scroll', elevateOnScroll, { passive: true });

// ===== Altura dinámica del header (evita solapes) =====
function setHeaderVar(){
  const h = header?.offsetHeight || 64;
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}
setHeaderVar();
window.addEventListener('load', setHeaderVar);
window.addEventListener('resize', setHeaderVar);

// Recalcular cuando cambie el tamaño de fuente del sistema (zoom)
window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', setHeaderVar);

// ===== Menú mobile accesible + bloqueo de scroll =====
if (toggleBtn && nav) {
  const toggleNav = () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    nav.setAttribute('aria-expanded', String(next));
    toggleBtn.setAttribute('aria-expanded', String(next));
    document.body.classList.toggle('menu-open', next); // bloquea scroll al abrir
    setHeaderVar(); // por si la barra cambia de alto
  };

  toggleBtn.addEventListener('click', toggleNav);

  // Cerrar al navegar por un enlace dentro del menú en mobile
  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('a') && window.innerWidth <= 860) {
      nav.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      setHeaderVar();
    }
  });

  // Inicio: contraído
  nav.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-expanded', 'false');
}

// Cerrar menú si se cambia a desktop (evita estado colgado)
window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && nav) {
    nav.setAttribute('aria-expanded', 'false');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

// ===== Filtros portfolio =====
const filterButtons = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');

function applyFilter(type) {
  works.forEach((card) => {
    const cardType = card.getAttribute('data-type');
    const match = type === 'all' || type === cardType;
    card.style.display = match ? '' : 'none';
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const type = btn.getAttribute('data-filter');
    applyFilter(type);
  });
});

// ===== Animaciones on-scroll (reduce motion friendly) =====
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && 'IntersectionObserver' in window) {
  const reveal = (el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  };
  const show = (el) => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  };

  const observed = document.querySelectorAll(
    '.card, .work, .about-card, .steps li, .pay, .contact-form'
  );
  observed.forEach(reveal);

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        show(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  observed.forEach((el) => io.observe(el));
}

// ===== Enlaces internos: foco accesible después del scroll =====
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  // Dejar que el navegador haga el scroll y después mover el foco
  setTimeout(() => {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }, 300);
});

// Al cargar con hash (#seccion), ajustar scroll-margin automáticamente
window.addEventListener('load', () => {
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView();
    }
  }
});

// ===== Utilidad: reemplazar el teléfono de WhatsApp en un solo lugar =====
// Editá este número; el JS actualizará los enlaces que tengan el placeholder.
const WHATSAPP_NUMBER = '5493510000000'; // ejemplo: 5493511234567

(function updateWhatsAppLinks() {
  if (!WHATSAPP_NUMBER) return;
  const placeholderSelector = 'a[href^="https://wa.me/XXXXXXXXXXX"]';
  const links = document.querySelectorAll(placeholderSelector);
  links.forEach((a) => {
    try {
      const u = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
      const orig = new URL(a.href);
      if (orig.search) u.search = orig.search; // conserva el ?text prellenado
      a.href = u.toString();
    } catch {
      // si falla URL(), lo dejamos como está
    }
  });
})();
/* ===============================
   Toggle de tema (default: claro)
   - Persiste en localStorage
   - Actualiza <meta name="theme-color">
   - Cambia icono y aria-pressed
=================================*/
(function themeToggleSetup(){
  const ROOT = document.documentElement;
  const BTN = document.getElementById('theme-toggle');
  if (!BTN) return;

  const THEME_KEY = 'a14_theme';
  const META = document.querySelector('meta[name="theme-color"]');

  // Colores para status bar/navegador
  const LIGHT_META = '#ff5a00';            // ya lo tenés
  const DARK_META  = '#0f1215';

 function applyTheme(mode){
  const isDark = mode === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light'); // <- nunca remove
  const btn = document.getElementById('theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (btn){
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.querySelector('.theme-ico').textContent = isDark ? '☀️' : '🌙';
  }
  if (meta) meta.setAttribute('content', isDark ? '#0f1215' : '#ff5a00');
  try { typeof setHeaderVar === 'function' && setHeaderVar(); } catch {}
}



  // Estado inicial: leé preferencia guardada (o claro si no hay)
  const saved = localStorage.getItem(THEME_KEY);
  const initial = (saved === 'dark' || saved === 'light') ? saved : 'light';
  applyTheme(initial);

  // Toggle al click
  BTN.addEventListener('click', () => {
    const isDark = ROOT.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
})();
