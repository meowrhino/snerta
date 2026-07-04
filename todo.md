# TODO - Web Berta Esteve (actualizado 2026-07-04)

## Hecho en la revisión de julio 2026

- [x] Todas las imágenes de galería convertidas a webp (máx 1600px): 315 MB → ~31 MB. Script: `tools/convertir-webp.sh`.
- [x] Lazy loading en las galerías (`loading="lazy"` + `decoding="async"`).
- [x] Arreglado: "why i don't remember artists" enlazaba a un 404 (ahora sale sin enlace hasta que tenga ficha).
- [x] Arreglado: "level 362" tenía ficha pero no salía en el listado (añadido en *mediació* — **Berta: confirma la categoría**).
- [x] Arreglado: doble render del listado en `renderProjectes.js`.
- [x] Arreglado: fuga de listeners de teclado en el popup de galería.
- [x] Favicon (saltamontes) y fuente cargada con preconnect en vez de `@import`.
- [x] README para Berta: `README_BERTA.md`.
- [x] Validador de contenido: `node tools/validar.js` (sintaxis JSON, fichas que faltan, imágenes rotas).
- [x] Generador de galerías: `node tools/galeria.js <carpeta>`.
- [x] Limpieza: borrados `old/`, `data/proyectos_cat/falsos/`, css viejos, `projectes.json` obsoleto, pngs de sobres sin usar y todos los originales jpg/jpeg/png ya convertidos (recuperables del historial de git).

## Pendiente

- [ ] **Decidir qué hacer con el motor de idiomas** → plan completo en `IDIOMAS.md`. Lo caro no es el código, es que Berta traduzca 40 fichas × 2 idiomas y mantenga 3 versiones de cada proyecto nuevo.
- [ ] Comprimir los 2 PDFs gigantes de `data/arxius/` (47 MB y 43 MB). Desde Vista Previa: Exportar → "Reduce File Size", o instalar ghostscript.
- [ ] Ficha para "why i don't remember artists" (o `"url"` externa a wetland.network) y devolverle el `slug` en el listado.
- [ ] SEO por proyecto (meta description / og:image dinámicos en projecte.html).
- [ ] Opcional: miniaturas separadas para el grid de galería (ahora grid y popup usan el mismo webp).
- [ ] Opcional: adelgazar el historial de git (~416 MB de imágenes viejas; `git filter-repo` o BFG, con cuidado).

## Flujo para Berta

Ver `README_BERTA.md`. Resumen: fotos webp a `img/<carpeta>/`, entrada en
`data/projectes_cat.json`, ficha en `data/proyectos_cat/<slug>.json`, y
`node tools/validar.js` para comprobar.
