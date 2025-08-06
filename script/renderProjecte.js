function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

async function cargarDatosProyecto(slug) {
  const res = await fetch(`data/proyectos_cat/${slug}.json`);
  if (!res.ok) {
    document.getElementById('projecte-content').innerHTML = "<p>No s'ha trobat el projecte.</p>";
    return;
  }
  return await res.json();
}

function renderProyecto(datos) {
  let html = `
    <h1>${datos.titol}</h1>
    <div class="ficha-tecnica">${datos.ficha_tecnica || ""}</div>
    <img src="${datos.imatge_principal || ""}" alt="${datos.titol}" />
    <div class="sinopsi">${datos.sinopsi || ""}</div>
  `;
  if (datos.text1) html += `<div class="text1">${datos.text1}</div>`;
  if (datos.galeria && datos.galeria.length > 0) {
    html += `<div class="galeria">` + datos.galeria.map(img => `<img src="${img}" alt="">`).join('') + `</div>`;
  }
  if (datos.text2) html += `<div class="text2">${datos.text2}</div>`;
  if (datos.projectes_relacionats && datos.projectes_relacionats.length > 0) {
    html += `<div class="projectes-relacionats"><h3>Projectes relacionats:</h3><ul>`;
    for (const pr of datos.projectes_relacionats) {
      if (pr.url) {
        html += `<li><a href="${pr.url}" target="_blank">${pr.titol}</a></li>`;
      } else if (pr.slug) {
        html += `<li><a href="projecte.html?slug=${pr.slug}">${pr.titol}</a></li>`;
      } else {
        html += `<li>${pr.titol}</li>`;
      }
    }
    html += `</ul></div>`;
  }
  return html;
}

async function renderPaginaProyecto() {
  const slug = getSlugFromUrl();
  if (!slug) {
    document.getElementById('projecte-content').innerHTML = "<p>Error: No s'ha especificat cap projecte.</p>";
    return;
  }
  const datos = await cargarDatosProyecto(slug);
  if (!datos) return;
  document.getElementById('projecte-content').innerHTML = renderProyecto(datos);
}

document.addEventListener('DOMContentLoaded', renderPaginaProyecto);