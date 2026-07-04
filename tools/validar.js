// Validador de contenido de la web (catalán + traducciones es/en).
// Uso: node tools/validar.js
// Comprueba sintaxis JSON, fichas que faltan, imágenes rotas y avisa de
// qué traducciones aún no existen (esas caen automáticamente al catalán).

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IDIOMAS = ["cat", "es", "en"];
let errores = 0;
let avisos = 0;

const error = (m) => { errores++; console.log("  ✗ ERROR: " + m); };
const aviso = (m) => { avisos++; console.log("  ⚠ aviso: " + m); };

function leerJSON(ruta) {
  const abs = path.join(ROOT, ruta);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    error(`${ruta} tiene un error de sintaxis JSON: ${e.message}`);
    return "ERROR";
  }
}

// --- Listados por idioma ---
console.log("Comprobando listados data/projectes_<idioma>.json...");
const slugsCat = new Set();
for (const l of IDIOMAS) {
  const listado = leerJSON(`data/projectes_${l}.json`);
  if (listado === "ERROR") continue;
  if (!listado) {
    if (l === "cat") error("falta data/projectes_cat.json (imprescindible)");
    else aviso(`no existe data/projectes_${l}.json (el listado saldrá en catalán)`);
    continue;
  }
  const slugs = listado.filter((p) => p.slug).map((p) => p.slug);
  slugs.forEach((s, i) => { if (slugs.indexOf(s) !== i) error(`slug duplicado en projectes_${l}.json: ${s}`); });
  listado.forEach((p) => {
    if (!p.titol) error(`entrada sin "titol" en projectes_${l}.json`);
    if (!p.categoria) error(`"${p.titol}" sin "categoria" en projectes_${l}.json`);
  });
  if (l === "cat") slugs.forEach((s) => slugsCat.add(s));
}

// --- Fichas por idioma ---
console.log("Comprobando fichas e imágenes...");
const dirCat = path.join(ROOT, "data/proyectos_cat");
const fichasCat = fs.readdirSync(dirCat).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

// cada slug del listado catalán tiene su ficha, y viceversa
fichasCat.forEach((f) => { if (!slugsCat.has(f)) aviso(`data/proyectos_cat/${f}.json existe pero no está en el listado`); });
slugsCat.forEach((s) => { if (!fichasCat.includes(s)) error(`"${s}" está en el listado pero falta data/proyectos_cat/${s}.json (irá al 404)`); });

for (const l of IDIOMAS) {
  const dir = path.join(ROOT, `data/proyectos_${l}`);
  if (!fs.existsSync(dir)) {
    if (l !== "cat") aviso(`no existe data/proyectos_${l}/ (todas las fichas saldrán en catalán)`);
    continue;
  }
  let faltanTrad = 0;
  for (const f of fichasCat) {
    const ficha = leerJSON(`data/proyectos_${l}/${f}.json`);
    if (ficha === "ERROR") continue;
    if (!ficha) { faltanTrad++; continue; }
    const imgs = [...(ficha.galeria || []), ficha.imatge_principal].filter(Boolean);
    for (const img of imgs) {
      if (!fs.existsSync(path.join(ROOT, img)))
        error(`proyectos_${l}/${f}.json referencia una imagen que no existe: ${img}`);
    }
  }
  if (l !== "cat" && faltanTrad > 0)
    aviso(`${faltanTrad} ficha(s) sin traducir a "${l}" (saldrán en catalán): ok, es opcional`);
}

console.log("");
if (errores === 0 && avisos === 0) {
  console.log("✓ Todo correcto: JSONs válidos, fichas completas e imágenes en su sitio.");
} else {
  console.log(`Resultado: ${errores} error(es), ${avisos} aviso(s).`);
  if (errores > 0) process.exitCode = 1;
}
