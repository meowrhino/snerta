// Genera index-es.html e index-en.html a partir de index.html (la portada
// en catalán, que es la fuente de verdad) y data/home_translations.json.
// Uso: node tools/build-homes.js
//
// Así se edita la home UNA sola vez (index.html + home_translations.json)
// en lugar de mantener tres HTML casi idénticos a mano.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RUTA_PLANTILLA = path.join(ROOT, "index.html");
const RUTA_TRADUCCIONES = path.join(ROOT, "data/home_translations.json");

function errorClaro(mensaje) {
  console.error("\n✗ " + mensaje + "\n");
  process.exit(1);
}

// --- 1) Cargar la plantilla (index.html) ---
if (!fs.existsSync(RUTA_PLANTILLA)) {
  errorClaro("No encuentro index.html (la portada en catalán). Sin ese archivo no puedo generar nada.");
}
const plantillaOriginal = fs.readFileSync(RUTA_PLANTILLA, "utf8");

// --- 2) Cargar y validar las traducciones ---
if (!fs.existsSync(RUTA_TRADUCCIONES)) {
  errorClaro(
    "Falta el archivo data/home_translations.json con los textos en castellano e inglés de la portada.\n" +
    "  Créalo con las claves \"es\" y \"en\" (mira el ejemplo en README_BERTA.md)."
  );
}
let traducciones;
try {
  traducciones = JSON.parse(fs.readFileSync(RUTA_TRADUCCIONES, "utf8"));
} catch (e) {
  errorClaro(
    "data/home_translations.json tiene un error y no se puede leer.\n" +
    "  Detalle técnico: " + e.message + "\n" +
    "  Revisa que no falte una coma, una comilla o una llave { } en el archivo."
  );
}

// Lista de campos que TIENEN que existir para cada idioma, con un texto
// de ayuda claro sobre qué es cada uno (Berta no es programadora).
const CAMPOS_REQUERIDOS = [
  ["lang", "el código de idioma (\"es\" o \"en\")"],
  ["meta.description", "la descripción para buscadores (meta description)"],
  ["meta.keywords", "las palabras clave para buscadores (meta keywords)"],
  ["meta.author", "el nombre de autora (meta author)"],
  ["heroLinks.grupEstudi", "el texto del enlace \"sobre grup d'estudi\""],
  ["heroLinks.unfunnyCurator", "el texto del enlace \"sobre Unfunny_Curator\""],
  ["heroLinks.fanfiction", "el texto del enlace \"sobre fanfiction\""],
  ["heroLinks.backrooms", "el texto del enlace \"sobre els backrooms\""],
  ["subtext.linea1", "la primera línea bajo el título (curadora, investigadora...)"],
  ["subtext.linea2", "la segunda línea bajo el título (expos, jajas & internet)"],
  ["descripcio.ariaLabel", "la etiqueta de accesibilidad de la sección \"sobre mi\""],
  ["descripcio.cvLinkText", "el texto del enlace al CV (\"cv aquí\")"],
  ["categories.curadoria", "la categoría \"curadoria\""],
  ["categories.investigacio", "la categoría \"investigació\""],
  ["categories.exposicions", "la categoría \"exposicions\""],
  ["categories.mediacio", "la categoría \"mediació\""],
  ["categories.text", "la categoría \"divulgació\""],
  ["categories.grupdestudi", "la categoría \"grup d'estudi\""],
  ["acompanyaments.ariaLabel", "la etiqueta de accesibilidad de \"acompanyaments\""],
  ["acompanyaments.heading", "el título \"puc ajudar-te a:\""],
  ["acompanyaments.paragraph", "el párrafo de precios/proyectos de \"acompanyaments\""],
  ["contacte.ariaLabel", "la etiqueta de accesibilidad de \"contacte\""],
  ["menuAbajo.descripcio", "el texto \"sobre mi\" del menú inferior"],
  ["menuAbajo.projectes", "el texto \"projectes\" del menú inferior"],
  ["menuAbajo.acompanyaments", "el texto \"acompanyaments\" del menú inferior"],
  ["menuAbajo.contacte", "el texto \"contacte\" del menú inferior"]
];

function obtener(obj, ruta) {
  return ruta.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

for (const idioma of ["es", "en"]) {
  if (!traducciones[idioma]) {
    errorClaro(`Falta el bloque "${idioma}" en data/home_translations.json (los textos en ese idioma).`);
  }
  for (const [ruta, descripcion] of CAMPOS_REQUERIDOS) {
    const valor = obtener(traducciones[idioma], ruta);
    if (valor === undefined || valor === null || valor === "") {
      errorClaro(
        `Falta un texto en data/home_translations.json.\n` +
        `  Idioma: "${idioma}"\n` +
        `  Campo: "${ruta}" → ${descripcion}\n` +
        `  Añade ese campo con su texto y vuelve a ejecutar el script.`
      );
    }
  }
  const parrafos = obtener(traducciones[idioma], "descripcio.parrafos");
  if (!Array.isArray(parrafos) || parrafos.length !== 3 || parrafos.some((p) => !p)) {
    errorClaro(
      `El idioma "${idioma}" necesita "descripcio.parrafos" con exactamente 3 textos ` +
      `(los 3 párrafos de la sección "sobre mi"). Ahora mismo no están completos.`
    );
  }
  const items = obtener(traducciones[idioma], "acompanyaments.items");
  if (!Array.isArray(items) || items.length !== 6 || items.some((i) => !i)) {
    errorClaro(
      `El idioma "${idioma}" necesita "acompanyaments.items" con exactamente 6 textos ` +
      `(curar, conceptualitzar, produir, investigar, mediar, coordinar). Ahora mismo no están completos.`
    );
  }
}

// --- 3) Limpieza estructural de la plantilla ---
// index.html tiene comentarios de trabajo y algunas líneas en blanco de más
// que no deben salir en las páginas traducidas (son solo notas para Berta).
function limpiarPlantilla(html) {
  // Quita cualquier comentario HTML que ocupe su(s) propia(s) línea(s) entera(s).
  html = html.replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*\r?\n/gm, "");

  // Las siguientes 5 líneas arreglan huecos en blanco que quedan al quitar
  // esos comentarios (o que ya existían solo en la plantilla catalana).
  html = html.replace(/(<\/head>\n)\n+(<body>)/, "$1\n$2");
  html = html.replace(/(berta esteve\n)\n+(\s*<\/h1>)/, "$1$2");
  html = html.replace(/(<section id="descripcio"[^>]*>\n)\n+(\s*<p>)/, "$1\n$2");
  html = html.replace(/(<\/section>\n)\n+(\s*<div class="menu-links menu-abajo">)/, "$1\n$2");
  html = html.replace(/(<div class="menu-links menu-abajo">[\s\S]*?\n {8}<\/div>)\n\n(\s*<\/div>\n\n<\/body>)/, "$1\n$2");

  return html;
}

// --- 4) Sustitución de textos por idioma ---
function extraerSeccion(html, inicioMarca, id) {
  const inicio = html.indexOf(inicioMarca);
  if (inicio === -1) {
    errorClaro(
      `No encuentro en index.html "${inicioMarca}".\n` +
      `  Puede que hayas cambiado o borrado esa sección (id="${id}").\n` +
      `  Si lo has hecho a propósito, hay que actualizar también tools/build-homes.js.`
    );
  }
  const fin = html.indexOf("</section>", inicio);
  if (fin === -1) {
    errorClaro(`La sección id="${id}" de index.html no tiene un "</section>" de cierre.`);
  }
  const finReal = fin + "</section>".length;
  return { antes: html.slice(0, inicio), seccion: html.slice(inicio, finReal), despues: html.slice(finReal) };
}

function sustituir(html, regex, reemplazo, campo) {
  if (!regex.test(html)) {
    errorClaro(
      `No encuentro en index.html el sitio para "${campo}".\n` +
      `  Puede que hayas cambiado la estructura del HTML.\n` +
      `  Si lo has hecho a propósito, hay que actualizar también tools/build-homes.js.`
    );
  }
  return html.replace(regex, reemplazo);
}

function generarHTML(plantilla, t) {
  let html = plantilla;

  // <html lang="...">
  html = sustituir(html, /<html lang="[^"]*">/, () => `<html lang="${t.lang}">`, "lang");

  // Metas
  html = sustituir(
    html, /(<meta name="description" content=")[^"]*(">)/,
    (_, a, b) => a + t.meta.description + b, "meta.description"
  );
  html = sustituir(
    html, /(<meta name="keywords" content=")[^"]*(">)/,
    (_, a, b) => a + t.meta.keywords + b, "meta.keywords"
  );
  html = sustituir(
    html, /(<meta name="author" content=")[^"]*(">)/,
    (_, a, b) => a + t.meta.author + b, "meta.author"
  );

  // Enlaces del hero (sobre1..sobre4)
  const heroPorClase = [
    ["sobre1", t.heroLinks.grupEstudi],
    ["sobre2", t.heroLinks.unfunnyCurator],
    ["sobre3", t.heroLinks.fanfiction],
    ["sobre4", t.heroLinks.backrooms]
  ];
  for (const [clase, texto] of heroPorClase) {
    const regex = new RegExp(`(class="link-sobre ${clase}">\\s*<img[^>]*\\/>\\n\\s*)[^\\n]*(\\n\\s*<\\/a>)`);
    html = sustituir(html, regex, (_, a, b) => a + texto + b, `heroLinks.${clase}`);
  }

  // Subtítulo bajo el título (2 líneas)
  html = sustituir(
    html, /(<div class="berta-subtext">\s*<p>)[^<]*(<\/p>)/,
    (_, a, b) => a + t.subtext.linea1 + b, "subtext.linea1"
  );
  html = sustituir(
    html, /(<\/p>\s*<p>)[^<]*(<\/p>\s*<\/div>)/,
    (_, a, b) => a + t.subtext.linea2 + b, "subtext.linea2"
  );

  // --- Sección "descripcio" (sobre mi) ---
  {
    const { antes, seccion, despues } = extraerSeccion(html, '<section id="descripcio"', "descripcio");
    let sec = seccion;

    sec = sustituir(sec, /(<section id="descripcio" aria-label=")[^"]*(">)/, (_, a, b) => a + t.descripcio.ariaLabel + b, "descripcio.ariaLabel");

    const parrafosEncontrados = sec.match(/<p>[\s\S]*?<\/p>/g);
    if (!parrafosEncontrados || parrafosEncontrados.length !== 3) {
      errorClaro(
        `Dentro de la sección id="descripcio" de index.html esperaba encontrar 3 párrafos <p> ` +
        `(el texto biográfico) y he encontrado ${parrafosEncontrados ? parrafosEncontrados.length : 0}.`
      );
    }
    let i = 0;
    sec = sec.replace(/<p>[\s\S]*?<\/p>/g, () => `<p>${t.descripcio.parrafos[i++]}</p>`);

    sec = sustituir(
      sec, /(☆\.。\.: )(.*?)( ☆\.。\.:)/,
      (_, a, _texto, b) => a + t.descripcio.cvLinkText + b, "descripcio.cvLinkText"
    );

    html = antes + sec + despues;
  }

  // --- Sección "projectes" (categorías) ---
  {
    const { antes, seccion, despues } = extraerSeccion(html, '<section id="projectes">', "projectes");
    let sec = seccion;
    const categoriasPorAncla = [
      ["#curadoria", t.categories.curadoria],
      ["#investigacio", t.categories.investigacio],
      ["#exposicions", t.categories.exposicions],
      ["#mediacio", t.categories.mediacio],
      ["#text", t.categories.text],
      ["#grupdestudi", t.categories.grupdestudi]
    ];
    for (const [ancla, texto] of categoriasPorAncla) {
      const regex = new RegExp(`(<a href="projectes\\.html${ancla}">)[^<]*(<\\/a>)`);
      sec = sustituir(sec, regex, (_, a, b) => a + texto + b, `categories (${ancla})`);
    }
    html = antes + sec + despues;
  }

  // --- Sección "acompanyaments" ---
  {
    const { antes, seccion, despues } = extraerSeccion(html, '<section id="acompanyaments"', "acompanyaments");
    let sec = seccion;

    sec = sustituir(sec, /(<section id="acompanyaments" aria-label=")[^"]*(">)/, (_, a, b) => a + t.acompanyaments.ariaLabel + b, "acompanyaments.ariaLabel");
    sec = sustituir(sec, /(<h3>)[^<]*(<\/h3>)/, (_, a, b) => a + t.acompanyaments.heading + b, "acompanyaments.heading");

    const itemsEncontrados = sec.match(/<h4>[^<]*<\/h4>/g);
    if (!itemsEncontrados || itemsEncontrados.length !== 6) {
      errorClaro(
        `Dentro de la sección id="acompanyaments" de index.html esperaba encontrar 6 elementos <h4> ` +
        `(curar, conceptualitzar...) y he encontrado ${itemsEncontrados ? itemsEncontrados.length : 0}.`
      );
    }
    let i = 0;
    sec = sec.replace(/<h4>[^<]*<\/h4>/g, () => `<h4>${t.acompanyaments.items[i++]}</h4>`);

    sec = sustituir(sec, /<p>[\s\S]*?<\/p>/, () => `<p>${t.acompanyaments.paragraph}</p>`, "acompanyaments.paragraph");

    html = antes + sec + despues;
  }

  // --- Sección "contacte" ---
  {
    const { antes, seccion, despues } = extraerSeccion(html, '<section id="contacte"', "contacte");
    let sec = seccion;
    sec = sustituir(sec, /(<section id="contacte" aria-label=")[^"]*(">)/, (_, a, b) => a + t.contacte.ariaLabel + b, "contacte.ariaLabel");
    html = antes + sec + despues;
  }

  // --- Menú inferior ---
  html = sustituir(html, /(<a href="#descripcio">)[^<]*(<\/a>)/, (_, a, b) => a + t.menuAbajo.descripcio + b, "menuAbajo.descripcio");
  html = sustituir(html, /(<a href="#projectes">)[^<]*(<\/a>)/, (_, a, b) => a + t.menuAbajo.projectes + b, "menuAbajo.projectes");
  html = sustituir(html, /(<a href="#acompanyaments">)[^<]*(<\/a>)/, (_, a, b) => a + t.menuAbajo.acompanyaments + b, "menuAbajo.acompanyaments");
  html = sustituir(html, /(<a href="#contacte">)[^<]*(<\/a>)/, (_, a, b) => a + t.menuAbajo.contacte + b, "menuAbajo.contacte");

  // Asegura salto de línea final (index.html no lo tiene, pero las páginas
  // generadas sí, como siempre han tenido).
  if (!html.endsWith("\n")) html += "\n";

  return html;
}

// --- 5) Generar y escribir ---
const plantillaLimpia = limpiarPlantilla(plantillaOriginal);

for (const idioma of ["es", "en"]) {
  const html = generarHTML(plantillaLimpia, traducciones[idioma]);
  const destino = path.join(ROOT, `index-${idioma}.html`);
  fs.writeFileSync(destino, html, "utf8");
  console.log(`✓ Generado index-${idioma}.html`);
}

console.log("\nListo. Revisa los cambios con: git diff index-es.html index-en.html");
