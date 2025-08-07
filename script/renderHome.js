function getIdioma() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");

  if (lang) {
    localStorage.setItem("lang", lang);
    return lang;
  }

  return localStorage.getItem("lang") || "cat";
}

async function cargarDatos(url) {
  const res = await fetch(url);
  return await res.json();
}

async function renderHome() {
  const idioma = getIdioma();
  const data = await cargarDatos(`data/main_${idioma}.json`);
  const container = document.querySelector(".container");

  // Reconstruimos el bloque #berta igual que en el index.html
  const title = data.find(s => s.type === "title");
  const links = data.find(s => s.type === "berta-links");
  const subtext = data.find(s => s.type === "berta-subtext");

  let bertaHTML = `<section id="berta">
    <h1>${title.content}</h1>
    <div class="berta-links">
      ${links.links.map((link, i) => `
        <a href="${link.href}" class="link-sobre sobre${i + 1}">
          <img src="${link.img}" alt="" class="bg-sobre" />
          ${link.label}
        </a>
      `).join("")}
    </div>
    <div class="berta-subtext">
      ${subtext.lines.map(line => `<p>${line}</p>`).join("")}
    </div>
  </section>`;

  // Renderizamos el resto igual
  const restSections = data
    .filter(s => !["title", "berta-links", "berta-subtext"].includes(s.type))
    .map(renderSection)
    .join("");

  container.innerHTML = bertaHTML + restSections;

  crearMenuAbajo();
}

function renderSection(section) {
  const idioma = getIdioma();
  switch (section.type) {
    case "text":
      return `<section id="descripcio">${section.content.map(p => `<p>${p}</p>`).join("")}</section>`;
    case "sections":
      return `<section id="projectes">${section.items
        .map(
          (item) =>
            `<h4><a href="projectes.html?lang=${idioma}${item.anchor}">${item.label}</a></h4>`
        )
        .join("")}</section>`;
    case "acompanyaments":
      return `<section id="acompanyaments">
        <h3>${section.title}</h3>
        <ul class="serveis-grid">
          ${section.list
            .map((li) => `<li><h4>${li}</h4></li>`)
            .join("")}
        </ul>
        <p>${section.info}</p>
      </section>`;
    case "contacte":
      return `<section id="contacte">
        <h4><a href="mailto:${section.email}">${section.email}</a></h4>
        <div class="contacte-llinks">
          ${section.links
            .map((l) => `<h5><a href="${l.url}">${l.label}</a></h5>`)
            .join("")}
        </div>
      </section>`;
    default:
      return "";
  }
}

function crearMenuAbajo() {
  const items = [
    { label: "berta", anchor: "#berta" },
    { label: "sobre mi", anchor: "#descripcio" },
    { label: "projectes", anchor: "#projectes" },
    { label: "acompanyaments", anchor: "#acompanyaments" },
    { label: "contacte", anchor: "#contacte" },
  ];

  const menu = document.createElement("div");
  menu.classList.add("menu-links", "menu-abajo");

  items.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.anchor;
    a.textContent = item.label;
    menu.appendChild(a);
  });

  document.body.appendChild(menu);
}

document.addEventListener("DOMContentLoaded", renderHome);
