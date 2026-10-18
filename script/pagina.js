// Lo que hace cada página en el navegador.
//
// En la web construida (data-built en <html>) el contenido ya viene escrito:
// aquí solo se engancha la galería (el popup) y el salto a una categoría.
// En la vista previa (Live Server, sin build) además se pinta el contenido
// con script/house.js, como lo escribe el build, después de revisar cada
// JSON con su esquema (schema/): lo que esté mal sale en pantalla.

import { hasPage, homeHtml, listHtml, projectHtml, slugsOf } from "./house.js";
import { leerJSON, validar } from "./validar.js";

const BUILT = document.documentElement.hasAttribute("data-built");
const PAGE = document.body.dataset.page;
const LANG_KEY = { cat: "ca", es: "es", en: "en" }[window.LANG?.actual] || "ca";

/* ---------- la vista previa ---------- */

async function get(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) { showErrors([`no encuentro ${path}`]); throw new Error(`no encuentro ${path}`); }
  try { return leerJSON(await res.text(), path); } catch (e) { showErrors([e.message]); throw e; }
}

async function checked(path, type) {
  const data = await get(path);
  const errors = validar(data, await get(`schema/${type}.json`), path);
  if (errors.length) { showErrors(errors); throw new Error(errors.join("\n")); }
  return data;
}

function showErrors(errors) {
  let box = document.getElementById("errores-vista-previa");
  if (!box) {
    box = document.createElement("pre");
    box.id = "errores-vista-previa";
    box.style.cssText = "position:fixed;inset:0;z-index:99999;margin:0;padding:2rem;overflow:auto;white-space:pre-wrap;"
      + "background:#fff;color:#000;font:15px/1.5 monospace;";
    box.textContent = "esto no se publicaría:\n\n";
    document.body.append(box);
  }
  box.textContent += errors.map((e) => `✗ ${e}`).join("\n") + "\n\narréglalo, guarda, y la página se recarga sola.\n";
}

const href = (slug) => `projecte.html?slug=${encodeURIComponent(slug)}`;
const project = (slug) => checked(`projects/${slug}/project.json`, "project");

async function pintar() {
  const site = await checked("data/site.json", "site");
  let cont;
  if (PAGE === "home") {
    cont = document.getElementById("contenido");
    cont.innerHTML = homeHtml(site, await checked("data/about.json", "about"), LANG_KEY, { href, projectesHref: "projectes.html" });
  } else if (PAGE === "projectes") {
    const slugs = slugsOf(site);
    const projects = Object.fromEntries(await Promise.all(slugs.map(async (s) => [s, await project(s)])));
    cont = document.getElementById("projectes-list");
    cont.innerHTML = listHtml(site, projects, LANG_KEY, href);
  } else if (PAGE === "projecte") {
    const slug = (new URLSearchParams(location.search).get("slug") || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!slugsOf(site).includes(slug)) { location.href = "404.html"; return; }
    const p = await project(slug);
    if (!hasPage(p)) { location.href = "404.html"; return; }
    cont = document.getElementById("projecte-content");
    cont.innerHTML = projectHtml(slug, p, LANG_KEY, href);
  }
  if (cont && window.LANG) LANG.reescribirEnlaces(cont);
}

/* ---------- la galería: el popup ---------- */

function crearPopupGaleriaSimple(imagenes, idxInicial = 0) {
  // Elimina overlay si existe (por si acaso)
  const existente = document.querySelector(".galeria-popup-overlay");
  if (existente) existente.remove();

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

  // Cierra el popup y limpia el listener de teclado
  function cerrarPopup() {
    overlay.remove();
    document.removeEventListener("keydown", keyHandler);
  }

  // Cerrar al hacer click fuera de strip
  overlay.onclick = (e) => {
    if (e.target === overlay) cerrarPopup();
  };

  function keyHandler(e) {
    if (e.key === "Escape") cerrarPopup();
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

  renderStrip();
}

function engancharGaleria() {
  const imgs = [...document.querySelectorAll(".galeria img")];
  const srcs = imgs.map((img) => img.getAttribute("src"));
  imgs.forEach((img, idx) => {
    img.classList.add("galeria-img-clickable");
    img.onclick = () => crearPopupGaleriaSimple(srcs, idx);
  });
}

/* ---------- el listado: el salto a una categoría (#curadoria) ---------- */

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

function saltarAlHash(behavior) {
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (hash) scrollToIdWithOffset(hash, behavior);
}

/* ---------- arranque ---------- */

try {
  if (!BUILT) await pintar();
} finally {
  if (PAGE === "projecte") engancharGaleria();
  if (PAGE === "projectes") {
    saltarAlHash('auto');
    window.addEventListener('hashchange', () => saltarAlHash('smooth'));
  }
}
