async function cargarDatosProyecto(slug) {
  const res = await fetch(`data/proyectos_cat/${slug}.json`);
  return await res.json();
}

function renderProyecto(datos) {
  let html = `
    <h1>${datos.titol}</h1>
    <div class="ficha-tecnica">${datos.ficha_tecnica}</div>
    <img src="${datos.imatge_principal}" alt="${datos.titol}" class="imatge-principal" />
    <div class="sinopsi">${datos.sinopsi}</div>
  `;

  if (datos.text1) html += `<div class="text1">${datos.text1}</div>`;

  if (datos.galeria && datos.galeria.length > 0) {
    html += `<div class="galeria">`;
    for (const img of datos.galeria) {
      html += `<img src="${img}" alt="">`;
    }
    html += `</div>`;
  }

  if (datos.text2) html += `<div class="text2">${datos.text2}</div>`;

  if (datos.projectes_relacionats && datos.projectes_relacionats.length > 0) {
    html += `<div class="projectes-relacionats"><h3>Projectes relacionats:</h3><ul>`;
    for (const pr of datos.projectes_relacionats) {
      html += `<li><a href="projecte.html?slug=${pr.slug}">${pr.titol}</a></li>`;
    }
    html += `</ul></div>`;
  }

  return html;
}

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

async function renderPaginaProyecto() {
  const slug = getSlugFromUrl();
  if (!slug) {
    document.getElementById('project-content').innerHTML = "<p>Error: No s'ha especificat cap projecte.</p>";
    return;
  }
  const datos = await cargarDatosProyecto(slug);
  document.getElementById('project-content').innerHTML = renderProyecto(datos);
}

document.addEventListener('DOMContentLoaded', renderPaginaProyecto);