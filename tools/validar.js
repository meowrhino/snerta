// Validador de contenido de la web.
// Uso: node tools/validar.js
// Comprueba que los JSON son válidos, que cada proyecto del listado
// tiene su ficha, y que todas las imágenes referenciadas existen.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let errores = 0;
let avisos = 0;

function error(msg) {
  errores++;
  console.log("  ✗ ERROR: " + msg);
}
function aviso(msg) {
  avisos++;
  console.log("  ⚠ aviso: " + msg);
}

function leerJSON(ruta) {
  const abs = path.join(ROOT, ruta);
  if (!fs.existsSync(abs)) {
    error(`no existe el archivo ${ruta}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    error(`${ruta} tiene un error de sintaxis JSON: ${e.message}`);
    return null;
  }
}

console.log("Comprobando data/projectes_cat.json...");
const listado = leerJSON("data/projectes_cat.json");

const fichas = fs
  .readdirSync(path.join(ROOT, "data/proyectos_cat"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

if (listado) {
  const slugs = listado.filter((p) => p.slug).map((p) => p.slug);

  // slugs duplicados
  slugs.forEach((s, i) => {
    if (slugs.indexOf(s) !== i) error(`slug duplicado en el listado: ${s}`);
  });

  // cada slug del listado tiene ficha
  slugs.forEach((s) => {
    if (!fichas.includes(s))
      error(`"${s}" está en el listado pero falta data/proyectos_cat/${s}.json (el enlace irá al 404)`);
  });

  // cada ficha está en el listado
  fichas.forEach((f) => {
    if (!slugs.includes(f))
      aviso(`data/proyectos_cat/${f}.json existe pero no está en el listado (nadie podrá llegar a él)`);
  });

  // campos mínimos
  listado.forEach((p) => {
    if (!p.titol) error(`entrada del listado sin "titol": ${JSON.stringify(p).slice(0, 60)}...`);
    if (!p.categoria) error(`"${p.titol}" no tiene "categoria"`);
  });
}

console.log("Comprobando fichas de proyecto e imágenes...");
for (const f of fichas) {
  const ficha = leerJSON(`data/proyectos_cat/${f}.json`);
  if (!ficha) continue;
  const imgs = [...(ficha.galeria || []), ficha.imatge_principal].filter(Boolean);
  for (const img of imgs) {
    if (!fs.existsSync(path.join(ROOT, img)))
      error(`${f}.json referencia una imagen que no existe: ${img}`);
  }
}

console.log("");
if (errores === 0 && avisos === 0) {
  console.log("✓ Todo correcto: JSONs válidos, fichas completas e imágenes en su sitio.");
} else {
  console.log(`Resultado: ${errores} error(es), ${avisos} aviso(s).`);
  if (errores > 0) process.exitCode = 1;
}
