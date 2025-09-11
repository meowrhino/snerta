async function cargarProjectes() {
  const res = await fetch('data/projectes_cat.json');
  return await res.json();
}

const ordenCategorías = [
  { key: "curadoria", label: "curadoria" },
  { key: "investigacio", label: "investigació" },
  { key: "exposicions", label: "exposicions" },
  { key: "mediacio", label: "mediació" },
  { key: "text", label: "divulgació" },
  { key: "grupdestudi", label: "grup d'estudi" }
];

function renderProjecteLinea(p) {
  const linea = [
    p.espai,
    p.ciutat,
    p.text,
    p.feina,
    p.any
  ].filter(Boolean).join(', ');

  return `
    <div class="projecte-linia">
      <a href="projecte.html?slug=${p.slug}" class="projecte-link"><strong>${p.titol}</strong></a>${linea ? ', ' + linea : ''}
    </div>
  `;
}

async function renderProjectesPorCategoria() {
  const projectes = await cargarProjectes();
  const cont = document.getElementById('projectes-list');
  cont.innerHTML = '';

  ordenCategorías.forEach(cat => {
    const group = projectes.filter(p => p.categoria === cat.key);
    if (!group.length) return;

    const html = `
      <section class="projectes" id="${cat.key}">
        <h2>${cat.label}</h2>
        <div class="projectes-col">
          ${group.map(renderProjecteLinea).join('')}
        </div>
      </section>
    `;
    cont.innerHTML += html;
  });
}

function renderMenuLinks() {
  const menu = document.createElement('div');
  menu.className = 'menu-links';

  ordenCategorías.forEach(cat => {
    const a = document.createElement('a');
    a.href = `projectes.html#${cat.key}`;
    a.textContent = cat.label;
    menu.appendChild(a);
  });

  document.body.appendChild(menu);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjectesPorCategoria();
  // renderMenuLinks();
});

// === Anclaje robusto tras render dinámico ===

// Calcula un offset si tienes header fijo (opcional)
// 1) intenta leer CSS var --anchor-offset; 2) si no, intenta medir un header; 3) si nada, 0.
function getAnchorOffset() {
  const fromCSS = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--anchor-offset')) || 0;
  if (fromCSS) return fromCSS;

  const header = document.querySelector('header, .header, .menu, .navbar, .floating-menu');
  return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
}

function scrollToIdWithOffset(id, behavior = 'auto') {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.pageYOffset - getAnchorOffset();
  window.scrollTo({ top: y, behavior });
  return true;
}

// Espera a que aparezca el elemento con ese id en el DOM
function waitAndScrollToId(id, behavior = 'auto', timeoutMs = 2000) {
  // intenta ya
  if (scrollToIdWithOffset(id, behavior)) return;

  const targetRoot = document.getElementById('projectes-list') || document.body;
  let done = false;

  const obs = new MutationObserver(() => {
    if (scrollToIdWithOffset(id, behavior)) {
      done = true;
      obs.disconnect();
    }
  });
  obs.observe(targetRoot, { childList: true, subtree: true });

  // corta a los X ms por seguridad
  setTimeout(() => {
    if (!done) obs.disconnect();
  }, timeoutMs);
}

// 1) al cargar el DOM, renderiza y luego ancla si hay hash
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // si tu función de render es async, espera a que acabe;
    // si no lo es, no pasa nada por el await
    await renderProjectesPorCategoria();
  } finally {
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (hash) {
      // primer intento inmediato
      if (!scrollToIdWithOffset(hash, 'auto')) {
        // si aún no existe, espera a que aparezca
        waitAndScrollToId(hash, 'auto');
      }
    }
  }
});

// 2) si el usuario cambia de hash dentro de la misma página
window.addEventListener('hashchange', () => {
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (!hash) return;
  // intenta ya; si aún no está (muy raro), espera
  if (!scrollToIdWithOffset(hash, 'smooth')) {
    waitAndScrollToId(hash, 'smooth');
  }
});