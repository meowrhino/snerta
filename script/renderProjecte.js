function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

async function cargarDatosProyecto(slug) {
  const res = await fetch(`data/proyectos_cat/${slug}.json`);
  if (!res.ok) {
    document.getElementById("projecte-content").innerHTML =
      "<p>No s'ha trobat el projecte.</p>";
    return;
  }
  return await res.json();
}

// Helper para texto1
function renderTexto1(texto1) {
  if (!texto1) return "";
  if (Array.isArray(texto1)) {
    return texto1.map((t) => `<p>${t}</p>`).join("");
  } else {
    return `<p>${texto1}</p>`;
  }
}

function renderProyecto(datos) {
  let html = `<h1>${datos.titol}</h1>`;

  // Primera línea: año
  if (datos.any) {
    html += `<div class="projecte-any">${datos.any}</div>`;
  }

  // Segunda línea: lloc y ciutat en la misma línea
  if (datos.lloc || datos.ciutat) {
    const parts = [];
    if (datos.lloc) parts.push(datos.lloc);
    if (datos.ciutat) parts.push(datos.ciutat);
    html += `<div class="projecte-lloc-ciutat">${parts.join(" · ")}</div>`;
  }
  
  // Imagen principal
  if (datos.imatge_principal) {
    html += `<img src="${datos.imatge_principal}" alt="${datos.titol}" class="imatge-principal" />`;
  }

  // Texto 1
  html += `<div class="text">${renderTexto1(datos.text)}</div>`;

  // Projectes relacionats
  if (datos.projectes_relacionats && datos.projectes_relacionats.length > 0) {
    html += `<div class="projectes-relacionats"><ul>`;
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

  // Galería
  if (datos.galeria && datos.galeria.length > 0) {
    html +=
      `<div class="galeria">` +
      datos.galeria
        .map((img, idx) => `<img src="${img}" data-idx="${idx}" alt="">`)
        .join("") +
      `</div>`;
  }

  return html;
}

function crearPopupGaleriaSimple(imagenes, idxInicial = 0) {
  // Elimina overlay si existe (por si acaso)
  const existente = document.querySelector(".galeria-popup-overlay");
  if (existente) existente.remove();

  // Crea overlay
  const overlay = document.createElement("div");
  overlay.className = "galeria-popup-overlay";
  overlay.innerHTML = `
    <div class="popup-img-strip"></div>
  `;
  document.body.appendChild(overlay);

  let idxActual = idxInicial;

  function renderStrip() {
    const strip = overlay.querySelector(".popup-img-strip");
    strip.innerHTML = "";
    imagenes.forEach((img, idx) => {
      const div = document.createElement("div");
      div.className = "popup-img-item" + (idx === idxActual ? " active" : "");
      div.innerHTML = `<img src="${img}" draggable="false">`;
      if (idx !== idxActual) {
        div.onclick = (e) => {
          e.stopPropagation();
          idxActual = idx;
          renderStrip();
        };
      }
      strip.appendChild(div);
    });
    // Centra la imagen activa
    setTimeout(() => {
      const active = strip.querySelector(".popup-img-item.active");
      if (active)
        active.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    }, 0);
  }

  // Cerrar al hacer click fuera de strip
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // Tecla escape cierra
  function keyHandler(e) {
    if (e.key === "Escape") overlay.remove();
    if (e.key === "ArrowLeft") {
      idxActual = (idxActual - 1 + imagenes.length) % imagenes.length;
      renderStrip();
    }
    if (e.key === "ArrowRight") {
      idxActual = (idxActual + 1) % imagenes.length;
      renderStrip();
    }
  }
  document.addEventListener("keydown", keyHandler);

  // Limpia eventos al cerrar
  overlay.addEventListener("remove", () => {
    document.removeEventListener("keydown", keyHandler);
  });
  overlay.ontransitionend = function () {
    if (!document.body.contains(overlay))
      document.removeEventListener("keydown", keyHandler);
  };

  renderStrip();
}

async function renderPaginaProyecto() {
  const slug = getSlugFromUrl();
  if (!slug) {
    document.getElementById("projecte-content").innerHTML =
      "<p>Error: No s'ha especificat cap projecte.</p>";
    return;
  }
  const datos = await cargarDatosProyecto(slug);
  if (!datos) return;
  document.getElementById("projecte-content").innerHTML = renderProyecto(datos);

  // POPUP GALERÍA
  if (datos.galeria && datos.galeria.length > 0) {
    let mostrarImagenPopup;
    document.querySelectorAll(".galeria img").forEach((img, idx) => {
      img.classList.add("galeria-img-clickable");
      img.onclick = () => crearPopupGaleriaSimple(datos.galeria, idx);
    });
  }
}

document.addEventListener("DOMContentLoaded", renderPaginaProyecto);
