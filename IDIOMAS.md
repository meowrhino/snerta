# Motor de idiomas (CAT / ES / EN)

Estado: **implementado y en funcionamiento**. La web está en catalán, español e
inglés. El catalán es el idioma por defecto y el *fallback*: si falta cualquier
traducción, se muestra el catalán en su lugar (nunca un error ni una página en
blanco).

## Cómo funciona

Todo gira en torno a [`script/lang.js`](script/lang.js), que cargan todas las páginas.

**Cómo se decide el idioma** (`LANG.actual`):
1. Si estás en una home traducida (`index-es.html` / `index-en.html`), manda el archivo.
2. Si no, el parámetro `?lang=` de la URL.
3. Si no, el último idioma guardado en `localStorage`.
4. Si no, catalán.

El idioma elegido se guarda en `localStorage`, así se mantiene al navegar entre páginas.

**Qué hace `lang.js` en cada página:**
- Pinta el selector `CAT · ES · EN` arriba a la derecha (clase `.menu-idiomas`).
- Traduce las cadenas de interfaz marcadas con `data-i18n` (p. ej. el "enrere"/"atrás"/"back").
- Reescribe los enlaces internos para arrastrar el idioma (`?lang=`) y mandar a la home correcta.

**De dónde sale el contenido:**

| Página | Catalán | Español | Inglés |
|---|---|---|---|
| Home | `index.html` | `index-es.html` | `index-en.html` |
| Listado | `data/projectes_cat.json` | `data/projectes_es.json` | `data/projectes_en.json` |
| Fichas | `data/proyectos_cat/<slug>.json` | `data/proyectos_es/<slug>.json` | `data/proyectos_en/<slug>.json` |

Los scripts `renderProjectes.js` y `renderProjecte.js` piden el JSON del idioma
actual con `LANG.cargar(...)`, que prueba primero el idioma y, si el archivo no
existe, cae al catalán automáticamente.

## Reglas de oro al traducir

- **Los `slug` NUNCA se traducen**: son la clave que une listado, ficha e imágenes.
- **Las `galeria` y rutas de imágenes son idénticas** en los tres idiomas (las
  imágenes se comparten). Los scripts de generación las copian tal cual.
- **El HTML de dentro de los textos se conserva**: solo se traduce el texto
  visible, no las etiquetas `<a href='...'>` ni las URLs.
- Traducir es **opcional**: una ficha sin versión es/en sale en catalán. Se puede
  ir traduciendo poco a poco. `node tools/validar.js` avisa de cuántas faltan.

## Añadir/editar traducciones a mano

Para traducir una ficha nueva: copia `data/proyectos_cat/<slug>.json` a
`data/proyectos_es/<slug>.json` (y/o `_en/`), y traduce los campos `titol`, `text`
(y `lloc`/`any`/`ciutat` si hace falta), dejando `galeria` y `slug` igual.

Para el listado: edita `data/projectes_es.json` / `projectes_en.json` traduciendo
`text` y `feina` de cada entrada (los `slug` intactos).

Para la home: edita el HTML de `index-es.html` / `index-en.html`.

> Las traducciones actuales se generaron con los scripts de `scratchpad` en la
> revisión de julio 2026 a partir del catalán; a partir de ahora se mantienen a mano.

## Cadenas de interfaz (`data-i18n`)

Textos fijos que no viven en JSON (botón "atrás", mensaje del 404) están en el
diccionario `I18N` dentro de `lang.js`. Para traducir un texto fijo nuevo:
añade la clave a `I18N` y pon `data-i18n="clave"` en el elemento HTML.
