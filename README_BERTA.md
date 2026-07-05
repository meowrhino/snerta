# Guía para editar la web ✨

Hola Berta! Esta es la chuleta para añadir, editar o borrar proyectos sin miedo.

## Cómo funciona la web

- **`data/projectes_cat.json`** → el listado de la página "projectes" (título, dónde, qué hiciste, año).
- **`data/proyectos_cat/<slug>.json`** → la ficha de cada proyecto (textos largos + galería).
- **`img/<carpeta>/`** → las fotos de cada proyecto.

El `slug` es el nombre corto que une las dos cosas y sale en la URL
(ej. `caixa-sorpresa` → `projecte.html?slug=caixa-sorpresa`).

## Añadir un proyecto nuevo (3 pasos)

### 1. Sube las fotos

Crea una carpeta en `img/` (sin espacios ni acentos mejor, ej. `img/miproyecto/`)
y sube las fotos numeradas: `00.webp`, `01.webp`, `02.webp`...

> 📷 **Formato**: mejor **webp** y máximo **1600px** de lado. Si subes fotos de
> cámara a tamaño completo (6000px, varios MB) la página tardará muchísimo en
> cargar. En Mac puedes convertir con [Squoosh](https://squoosh.app) (web, gratis)
> o pedirle a manu que pase el script `tools/convertir-webp.sh`.

### 2. Añade la entrada al listado

En `data/projectes_cat.json`, copia un bloque existente de la misma categoría y cámbialo:

```json
{
  "categoria": "curadoria",
  "slug": "miproyecto",
  "titol": "el título que se verá",
  "espai": "dónde fue",
  "ciutat": "barcelona",
  "text": "qué es (exposició de tal...)",
  "feina": "qué hiciste tú",
  "any": 2026
},
```

Categorías posibles: `curadoria`, `investigacio`, `exposicions`, `mediacio`, `text` (divulgació), `grupdestudi`.

⚠️ **Cuidado con las comas**: cada bloque `{...}` lleva coma detrás **excepto el último de la lista**. Una coma de más o de menos rompe el JSON entero.

### 3. Crea la ficha del proyecto

Crea `data/proyectos_cat/miproyecto.json` (mismo nombre que el slug!). Copia
uno existente y edítalo:

```json
{
  "titol": "el título",
  "any": "2026",
  "lloc": "dónde fue (puede llevar <a href='...'>enlaces</a>)",
  "ciutat": "barcelona",
  "imatge_principal": "",
  "text": [
    "Primer párrafo.",
    "Segundo párrafo. Puede llevar <a href='https://...' target='_blank'>enlaces</a>."
  ],
  "galeria": [
    "img/miproyecto/00.webp",
    "img/miproyecto/01.webp"
  ],
  "projectes_relacionats": []
}
```

- `text` es una lista de párrafos, cada uno entre comillas y separados por comas.
- `galeria` puede quedarse `[]` si no hay fotos.
- Para enlazar otro proyecto de la web dentro de un texto:
  `<a href='projecte.html?slug=otro-slug'>nombre</a>`.

## Editar o borrar

- **Editar**: toca el JSON que corresponda y listo.
- **Borrar**: quita el bloque del listado (¡vigila las comas!). La ficha y las
  fotos pueden quedarse, no molestan.
- **Proyecto sin ficha**: si quieres que algo salga en el listado sin página
  propia, simplemente no pongas `slug` (saldrá el título sin enlace). También
  puedes poner `"url": "https://..."` para que el título enlace fuera.

## Comprobar que no has roto nada

Si trabajas desde el Mac con el repo descargado:

```
node tools/validar.js
```

Te dice si algún JSON tiene errores de sintaxis, si falta alguna ficha o si
alguna imagen referenciada no existe.

Y para generar la lista de la galería sin escribirla a mano:

```
node tools/galeria.js miproyecto
```

Te imprime el bloque `"galeria": [...]` listo para copiar y pegar.

## Idiomas (catalán / español / inglés)

La web está en tres idiomas. **El catalán es el principal**: si algo no está
traducido, sale en catalán automáticamente (nunca da error). Así que puedes
añadir un proyecto solo en catalán y ya funciona; traducirlo es opcional.

Cuando quieras traducir:
- **Un proyecto**: copia `data/proyectos_cat/<slug>.json` a
  `data/proyectos_es/<slug>.json` (español) o `data/proyectos_en/<slug>.json`
  (inglés) y traduce los textos. **Deja igual** `slug`, `galeria` y las imágenes.
- **El listado**: traduce `text` y `feina` en `data/projectes_es.json` /
  `projectes_en.json` (los `slug` no se tocan).
- **La portada**: NO se edita `index-es.html` ni `index-en.html` directamente
  (se generan solos y cualquier cambio a mano se perdería). El texto en
  catalán vive en `index.html`; el texto en castellano e inglés vive en
  `data/home_translations.json`. Después de tocar cualquiera de los dos,
  ejecuta:
  ```
  node tools/build-homes.js
  ```
  y regenera `index-es.html` / `index-en.html` automáticamente. Si falta algún
  texto en el JSON, el script te dice exactamente cuál.

Hay una explicación más detallada en `IDIOMAS.md`. Y `node tools/validar.js` te
dice qué proyectos aún no están traducidos (por si quieres ir completándolos).

## PDFs (cv, publicaciones)

Van en `data/arxius/`. Intenta que no pasen de unos 5 MB (desde Vista Previa
del Mac: Archivo → Exportar → filtro de cuarzo "Reduce File Size").
