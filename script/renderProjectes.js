async function cargarProjectes() {
  const res = await fetch('data/projectes_cat.json');
  return await res.json();
}

const ordenCategorías = [
  { key: "curadoria", label: "curadoria" },
  { key: "investigacio", label: "investigació" },
  { key: "exposicio", label: "exposició" },
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