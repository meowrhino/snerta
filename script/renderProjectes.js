async function cargarProjectes() {
  const res = await fetch('data/projectes_cat.json');
  return await res.json();
}

const ordenCategorias = [
  { key: "curadoria", label: "curadoria" },
  { key: "acompanyament", label: "acompanyament" },
  { key: "investigacio", label: "investigació" },
  { key: "exposicio", label: "exposicions" },
  { key: "mediacio", label: "mediació" },
  { key: "divulgacio", label: "text i divulgació" }
];

function renderProjecteLinea(p) {
  return `
    <div class="projecte-linia">
      <a href="projecte.html?slug=${p.slug}" class="projecte-link">
        <strong>${p.titol}</strong>
      </a>
      <div class="projecte-sinopsi">${p.sinopsi || ""}</div>
      <div class="projecte-any">${p.any}</div>
    </div>
  `;
}

async function renderProjectesPorCategoria() {
  const projectes = await cargarProjectes();
  const cont = document.getElementById('projectes-list');
  cont.innerHTML = '';

  ordenCategorias.forEach(cat => {
    const group = projectes.filter(p => p.categoria === cat.key);
    if (!group.length) return;

    const html = `
      <section class="projectes-cat" id="${cat.key}">
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

  ordenCategorias.forEach(cat => {
    // Si quieres juntar "curadoria" y "acompanyament", puedes agruparlos aquí
    // Pero si quieres cada uno por separado, simplemente deja así:
    const a = document.createElement('a');
    a.href = `projectes.html#${cat.key}`;
    a.textContent = cat.label;
    menu.appendChild(a);
  });

  // Añade el menú al body (o donde tú quieras)
  document.body.appendChild(menu);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjectesPorCategoria();
  renderMenuLinks();
});