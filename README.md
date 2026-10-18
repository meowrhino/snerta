# snerta

La web de Berta Esteve, curadora, investigadora y artista: la home, el listado de proyectos
por categoría y una página por proyecto, en catalán, castellano e inglés. Hecha por
[meowrhino.studio](https://meowrhino.studio) con la receta del estudio
([meowrhino/JAMstack](https://github.com/meowrhino/JAMstack)). Para Berta: [GUIA.md](GUIA.md).
Traspaso: [TRASPASO.md](TRASPASO.md). Si el build falla: [CLAUDE.md](CLAUDE.md).

```
snerta/
├── data/site.json          # nombre, dominio, las categorías (en 3 idiomas);
│                           #   "lists": en cada categoría, sus proyectos en orden
├── data/about.json         # la home (subtítulo, sobres, bio, cv, acompañamientos, contacto)
├── data/arxius/            # los PDF
├── projects/<slug>/        # un proyecto: project.json (su página + "card", su línea del
│                           #   listado) e img/1.webp, 2.webp…
├── schema/                 # qué campos lleva cada JSON (VS Code, el build y la vista previa)
├── index.html, projectes.html, projecte.html, 404.html   # las plantillas (y la vista previa)
├── build/build.mjs         # → dist/: cada página en cada idioma, con su contenido dentro
├── script/house.js         # pinta la home, el listado y la ficha (lo usan el build y pagina.js)
├── script/pagina.js        # la vista previa (pinta con house.js) y la galería
├── script/lang.js          # el idioma: selector CAT · ES · EN y enlaces (vista previa)
├── script/validar.js       # el JSON Schema sin dependencias (de JAMstack)
├── img/                    # los sobres y el saltamontes (no son de ningún proyecto)
└── fonts/                  # Playwrite NL en woff2 (sin Google Fonts)
```

## Cómo funciona

- **El build** (`npm ci && node build/build.mjs`) escribe cada página en cada idioma con el
  contenido dentro: `/`, `/projectes/` y `/<slug>/`, y lo mismo en `/es/` y `/en/`, con su
  title, description, canonical, `hreflang` y og:image (1200×630, **sharp**, en `.cache/`). En
  la web construida el JS no pinta nada: solo la galería y el selector de idioma. Las
  direcciones de antes (`projecte.html?slug=…&lang=…`, `index-es.html`) llevan a las nuevas.
- **Los idiomas**: cada texto, igual en los tres o `{ "ca", "es", "en" }`; lo que falte sale en
  catalán. Los enlaces a proyectos en los textos se escriben `projecte.html?slug=x` (valen en la
  vista previa) y el build los cambia por `/<idioma>/x/`.
- **Vista previa**: Live Server sobre la carpeta. Sin `data-built` en `<html>`,
  `script/pagina.js` revisa los JSON con `schema/`, pinta con `house.js` y enseña en pantalla
  lo que pararía el build. El idioma, con `?lang=es`.
- **Publicar**: las dos copias en **GitHub Pages** con la Action (`.github/workflows/deploy.yml`):
  el dominio de Berta está en DonDominio. En `meowrhino`, github.io sin indexar; en la de Berta,
  su dominio. Si falla, un issue.
