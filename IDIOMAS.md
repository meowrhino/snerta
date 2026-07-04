# Plan para el motor de idiomas (CAT / ES / EN)

Estado: **no implementado**. La web está solo en catalán. Este documento explica
qué hay ya hecho, qué falta, y el camino recomendado para terminarlo (o para
decidir no hacerlo, que también es una opción digna).

## Qué existe ya (herencia de la primera versión)

| Pieza | Dónde está | Estado |
|---|---|---|
| `getIdioma()` | `script/renderHome.js` | Funciona: lee `?lang=` de la URL, lo guarda en `localStorage`, por defecto `cat` |
| Render dinámico de la home | `script/renderHome.js` | Escrito pero **sin conectar**: `index.html` es estático y no lo carga |
| JSONs de la home en 3 idiomas | `paraElFuturo/data/main_cat.json`, `main_es.json`, `main_en.json` | Escritos, pero en `paraElFuturo/` (el script los busca en `data/`) y desactualizados respecto al index actual |
| Maqueta de home dinámica | `paraElFuturo/home.html` | Prueba de concepto |
| Menú de idiomas | comentado al final de `index.html` (`menu-arriba`) | Solo hay que descomentarlo cuando todo funcione |

## Qué falta (el trabajo de verdad)

El sistema actual tiene **tres capas de contenido**, y el motor solo cubre la primera:

1. **Home** (`index.html`) → cubierta por `renderHome.js` + `main_XX.json` ✅ (solo hay que conectarla)
2. **Listado** (`data/projectes_cat.json` + `renderProjectes.js`) → ❌ solo existe en catalán
3. **Fichas** (`data/proyectos_cat/*.json` + `renderProjecte.js`) → ❌ 40 fichas solo en catalán

Y la parte más cara no es código: es **traducir 40 fichas × 2 idiomas**. Eso es
trabajo de Berta. Si Berta no lo va a mantener (cada proyecto nuevo = escribirlo
3 veces), mejor borrar `paraElFuturo/` y `renderHome.js` y cerrar el tema.

## Camino recomendado si se hace

Principio: **un solo HTML por página, un JSON por idioma, y catalán como
fallback** (si falta una traducción se enseña el catalán, nunca un error).

### Paso 1 — Un helper compartido `script/lang.js`

Sacar `getIdioma()` de `renderHome.js` a un archivo propio que carguen las tres
páginas. Añadir una función `cargarJSON(base)` que intente
`data/${base}_${idioma}.json` y si el fetch falla (404) caiga a
`data/${base}_cat.json`. Con eso el fallback es automático y se puede traducir
poco a poco.

También aquí: función que pinte el menú CAT/ES/EN (`menu-arriba`, ya hay CSS)
enlazando a `?lang=cat|es|en` sobre la URL actual.

### Paso 2 — Home

- Mover `paraElFuturo/data/main_*.json` a `data/`.
- **Actualizar su contenido**: se escribieron antes de la versión actual del
  index (revisar textos, enlaces de sobres, sección acompanyaments, contacto).
- Conectar `renderHome.js` en `index.html` (`<script defer>`) y vaciar el
  contenido estático del `<div class="container">`.
- Ojo: la home perdería el contenido pre-renderizado (peor para SEO). Alternativa
  válida y más sencilla: dejar `index.html` estático en catalán y hacer
  `index_es.html` / `index_en.html` estáticos también — para 3 páginas de home,
  duplicar a mano no es pecado.

### Paso 3 — Listado

- Duplicar `data/projectes_cat.json` → `projectes_es.json`, `projectes_en.json`
  y traducir los campos `titol`, `text`, `feina` (los slugs **no se traducen
  nunca**: son la clave que une todo).
- En `renderProjectes.js`, cambiar el fetch fijo por el helper del paso 1 y
  añadir `?lang=` a los enlaces de las fichas.
- Las categorías (`ordenCategorías` con sus labels) también necesitan labels por
  idioma — moverlas al JSON o a un diccionario en `lang.js`.

### Paso 4 — Fichas

Dos opciones, elegir según lo que le sea más cómodo a Berta:

- **Opción A, carpetas por idioma** (`data/proyectos_es/<slug>.json`...):
  idéntico al sistema actual, el fallback del helper hace el resto. Ventaja:
  se puede traducir ficha a ficha sin prisa. Desventaja: 3 archivos por proyecto.
- **Opción B, un archivo con tres claves** (`{ "cat": {...}, "es": {...} }`):
  todo junto, pero rompe el formato actual (habría que migrar los 40 JSONs) y
  un error de sintaxis se lleva los 3 idiomas por delante. **Recomiendo la A.**

En `renderProjecte.js`: usar el helper con fallback y propagar `?lang=` en los
enlaces internos (`projecte.html?slug=X&lang=Y`). Ojo: hay enlaces internos
**escritos dentro de los textos** de las fichas (`<a href='projecte.html?slug=...'>`);
esos no propagarán el idioma por sí solos, pero como el idioma queda en
`localStorage`, no pasa nada.

### Paso 5 — Detalles finales

- Descomentar el `menu-arriba` de `index.html` (o generarlo desde `lang.js`).
- `document.documentElement.lang = idioma` al renderizar.
- Actualizar `tools/validar.js` para que valide también los JSONs de ES/EN
  (que existan las fichas traducidas o avisar de cuáles caen a fallback).
- Añadir el flujo a `README_BERTA.md`.

### Estimación honesta

- Código (pasos 1, 3, 4 y 5): una sesión tranquila.
- Contenido: la home ya está en 3 idiomas (revisar), el listado es rápido
  (campos cortos), **las 40 fichas son el 90% del esfuerzo** y son de Berta.

## Si se decide NO hacerlo

Borrar `paraElFuturo/`, `script/renderHome.js` y este archivo, y quitar el menú
de idiomas comentado de `index.html`. Fin.
