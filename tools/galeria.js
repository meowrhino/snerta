// Genera el array "galeria" de un proyecto a partir de su carpeta de imágenes.
// Uso: node tools/galeria.js <carpeta>
// Ejemplo: node tools/galeria.js caixasorpresa
// Imprime el array listo para copiar y pegar en el JSON del proyecto.

const fs = require("fs");
const path = require("path");

const carpeta = process.argv[2];
if (!carpeta) {
  console.log("Uso: node tools/galeria.js <nombre-de-carpeta-en-img>");
  console.log("Carpetas disponibles:");
  fs.readdirSync(path.join(__dirname, "../img"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .forEach((d) => console.log("  " + d.name));
  process.exit(1);
}

const dir = path.join(__dirname, "../img", carpeta);
if (!fs.existsSync(dir)) {
  console.log(`No existe la carpeta img/${carpeta}`);
  process.exit(1);
}

const imgs = fs
  .readdirSync(dir)
  .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
  .sort()
  .map((f) => `    "img/${carpeta}/${f}"`);

console.log('  "galeria": [');
console.log(imgs.join(",\n"));
console.log("  ]");
