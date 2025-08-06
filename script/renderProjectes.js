async function cargarProjectes() {
  const res = await fetch('data/projectes_cat.json');
  return await res.json();
}

function renderProjecteCard(p) {
  return `
    <div class="grid-item">
      <a href="projecte.html?slug=${p.slug}">
        <img src="${p.imatge}" alt="${p.titol}" />
        <h3>${p.titol}</h3>
        <div class="categoria">${p.categoria} · ${p.any}</div>
        <p>${p.sinopsi}</p>
      </a>
    </div>
  `;
}

async function renderProjectesGrid() {
  const projectes = await cargarProjectes();
  // Puedes agrupar por categoria aquí si quieres (añádelo fácil más tarde)
  const grid = `
    <div class="grid-items">
      ${projectes.map(renderProjecteCard).join('')}
    </div>
  `;
  document.getElementById('projectes-list').innerHTML = grid;
}

document.addEventListener('DOMContentLoaded', renderProjectesGrid);