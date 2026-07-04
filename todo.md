# TODO - Web Berta Esteve (actualizado 2026-07-04)

## Hecho en la revisión de julio 2026

### Rendimiento y limpieza
- [x] Imágenes de galería a webp (máx 1600px): 315 MB → ~31 MB. Script: `tools/convertir-webp.sh`.
- [x] Lazy loading en las galerías.
- [x] PDFs grandes comprimidos con ghostscript (49→13 MB y 45→4,5 MB, mismas páginas).
- [x] Borrados archivos muertos y originales jpg/png (recuperables del historial).
- [x] Favicon (saltamontes) y fuente con preconnect.

### Bugs
- [x] "why i don't remember artists" ya no lleva al 404 (sale sin enlace).
- [x] "level 362" añadido al listado (**en mediació — confirmado por manu**).
- [x] Doble render del listado y fuga de listeners del popup.

### Motor de idiomas (CAT/ES/EN) — implementado
- [x] `script/lang.js`: idioma por URL/localStorage/archivo, fallback a catalán, selector CAT·ES·EN, reescritura de enlaces, `data-i18n`.
- [x] Home traducida: `index-es.html`, `index-en.html`.
- [x] Listado traducido: `data/projectes_es.json`, `projectes_en.json`.
- [x] Las 40 fichas traducidas: `data/proyectos_es/`, `data/proyectos_en/`.
- [x] Documentado en `IDIOMAS.md` y `README_BERTA.md`.

### Herramientas para Berta
- [x] `node tools/validar.js` — valida los 3 idiomas, fichas que faltan, imágenes rotas, traducciones pendientes.
- [x] `node tools/galeria.js <carpeta>` — genera el array de galería.
- [x] `README_BERTA.md` — guía de edición y traducción.

## Pendiente / opcional

- [ ] Repasar las traducciones es/en (las hizo Claude; conviene una lectura de Berta, sobre todo matices).
- [ ] SEO por proyecto (meta description / og:image dinámicos en projecte.html).
- [ ] Miniaturas separadas para el grid de galería (ahora grid y popup usan el mismo webp).
- [ ] Adelgazar el historial de git (~pesa por imágenes viejas; `git filter-repo`/BFG con cuidado).
- [ ] La portada es HTML estático triplicado (index / index-es / index-en): si se cambia la estructura, tocar los tres.

## Flujo para Berta

Ver `README_BERTA.md`. Fotos webp a `img/<carpeta>/`, entrada en
`data/projectes_cat.json`, ficha en `data/proyectos_cat/<slug>.json`, y
`node tools/validar.js` para comprobar. Traducir es opcional (cae a catalán).
