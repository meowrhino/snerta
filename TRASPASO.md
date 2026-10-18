# Traspaso: la versión nueva a la copia de Berta

Berta ya tiene su copia, `bertaesteve/berta`, que publica `bertaesteve.cat` con
GitHub Pages (*legacy*: sirve los ficheros de `main` tal cual), y **la edita
ella** (su último cambio, "statement museografa", el 2026-02-18). Es la versión
de 2025: solo en catalán, `data/projectes_cat.json` + una ficha por proyecto en
`data/proyectos_cat/`, las fotos en `img/` (jpg y png grandes); el contenido lo
pinta el JS y Google lo ve vacío.

**Su contenido está aquí** (comparado el 2026-10-18): sus textos son los mismos,
y su cambio de febrero ("museògrafa", "museografia") está en `data/about.json`,
también en castellano e inglés. Lo nuestro, además: las traducciones es/en (las
hizo Claude en julio: que Berta las lea), las fotos en webp, los PDF
comprimidos, "level 362" en el listado y los enlaces rotos arreglados. Lo que
haya cambiado desde entonces hay que traerlo antes.

**Las dos copias publican en GitHub Pages**: el dominio está en DonDominio
apuntando a GitHub, y así no se toca. La Action corre en las dos y el build
decide por el dueño del repo: en `meowrhino`, github.io sin indexar; en la de
Berta, la raíz con el `url` de `site.json`. Nosotros solo podemos leer su repo.

Tiempo: unos 20 minutos, y un rato con ella: **cambia cómo edita** (de un
listado y una ficha por idioma a una carpeta por proyecto con todo dentro, y
la home en `data/about.json` en vez de `index.html`). Hablarlo antes.

## Antes

- [ ] `main` de meowrhino al día y sin cambios a medias (`git status` limpio).
- [ ] ¿Ha tocado algo Berta desde `2c49e3b` (2026-02-18)?
      `gh api repos/bertaesteve/berta/commits --jq '.[0:3][] | .sha[0:7]+" "+.commit.message'`.
      Si sí, pasar sus cambios aquí antes: una entrada de `data/projectes_cat.json` → `card`
      del `project.json`; su ficha (`data/proyectos_cat/<slug>.json`) → el resto; sus fotos a
      `projects/<slug>/img/` en webp, numeradas; lo de `index.html` → `data/about.json`.
- [ ] Que nos dé permiso de escribir (Settings → Collaborators → `meowrhino`, *Write*), o
      hacer el paso 2 desde su cuenta.

## 1. Berta cambia cómo publica su repo

- [ ] En `bertaesteve/berta`: **Settings → Pages → Source: GitHub Actions**. El dominio
      (`bertaesteve.cat`) se queda como está.

## 2. La versión nueva a su `main`

Su `main` y el nuestro han ido por separado. Se guarda la de antes en una rama y se sube la
nueva encima:

- [ ] `git push https://github.com/bertaesteve/berta.git <sha-de-su-main>:refs/heads/antes`
- [ ] `git push --force-with-lease=main:<sha-de-su-main> https://github.com/bertaesteve/berta.git main`
- [ ] En su repo, pestaña **Actions**: la de `build & deploy` en verde.

## 3. Comprobar en su dominio

- [ ] La home en los tres idiomas (`/`, `/es/`, `/en/`), el listado (`/projectes/#mediacio`) y
      un proyecto con galería (`/caixa-sorpresa/`: el popup).
- [ ] Las direcciones de antes: `projecte.html?slug=holets` y `index-es.html`.
- [ ] `view-source:` de un proyecto: el texto está en el HTML; `canonical` y `hreflang` con
      `bertaesteve.cat`, y **sin** `noindex`.
- [ ] `/robots.txt` dice `Allow` y `/sitemap.xml` tiene sus direcciones.
- [ ] Compartir un proyecto por WhatsApp: sale su foto (la og).

## 4. Search Console, con su cuenta de Google

- [ ] Dar de alta el dominio y enviar `sitemap.xml`.

## 5. Berta en su ordenador

Con ella delante, siguiendo [GUIA.md](GUIA.md):

- [ ] **Sincronizar**: la estructura cambia entera (si tenía cambios sin subir, antes).
- [ ] Live Server: **Go Live** y ve la vista previa (y el selector CAT · ES · EN).
- [ ] Un cambio pequeño (una coma en el about), Confirmar → Sincronizar, y la bolita verde.
- [ ] Que lea las traducciones al castellano y al inglés.

## 6. Al acabar

- [ ] Fila de snerta en `JAMstack/inventario.md` con las dos direcciones.
- [ ] El repo pesa (~450 MB de historia, por las fotos de antes): si molesta, adelgazarlo con
      `git filter-repo`, con cuidado y hablándolo antes.
