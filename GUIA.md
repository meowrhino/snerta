# Guía de la web

> **Regla de oro: solo se tocan `data/` y `projects/`.** Lo demás es el código.

## Qué hay

```
data/site.json             el nombre, el dominio, las categorías y qué proyectos salen en el
                           listado, en qué categoría y en qué orden ("lists")
data/about.json            la home: las líneas de debajo del nombre, los sobres, el texto de
                           "sobre mi", el cv, los acompañamientos y el contacto
data/arxius/               los PDF (el cv, publicaciones…)
projects/<nombre>/         un proyecto, una carpeta:
  project.json               su página y su línea en el listado ("card")
  img/                       sus fotos: 1.webp, 2.webp…
```

El **nombre de la carpeta** es también el de la dirección: `projects/holets/` →
`bertaesteve.cat/holets/` (y `/es/holets/`, `/en/holets/`). Minúsculas sin acentos ni ç,
números y guiones. Mejor no cambiarlo una vez publicado: rompería los enlaces que ya circulan.

**Los idiomas**: cada texto puede ir igual en los tres (`"barcelona"`) o uno por idioma
(`{ "ca": "…", "es": "…", "en": "…" }`). Lo que no esté traducido sale en catalán.

## La primera vez: preparar VS Code

Solo se hace una vez.

1. En VS Code: **Archivo → Nueva ventana** y, en la bienvenida, **Clonar repositorio Git…** →
   **Clonar desde GitHub**. Entra con tu cuenta, elige tu repositorio y una carpeta.
2. Al abrirla, VS Code propone instalar **Live Server** (abajo a la derecha): **Instalar**.
3. Abajo a la derecha sale **Go Live**: es la vista previa.

**VS Code te ayuda con los campos**: si pasas el ratón por encima de uno (`"title"`, `"card"`…)
te dice qué es, y si escribes uno mal o pones algo que no toca, lo subraya en rojo. Para ver
qué campos puedes poner, dentro de las llaves pulsa **Ctrl+Espacio**. Lo sabe por la primera
línea de cada JSON (`"$schema": …`): **no la borres**.

## Añadir un proyecto, paso a paso

1. **Copia una carpeta** de `projects/` y ponle el nombre nuevo: `projects/holets/` →
   `projects/nuevo/`. Borra sus fotos de `img/`.
2. **Las fotos**: pásalas por [imgToWeb](https://meowrhino.github.io/imgToWeb/), **en Chrome o
   Firefox** (Safari no sabe hacer `.webp`). Salen numeradas (`1.webp`, `2.webp`…) en el orden en
   que las arrastras: ponlas en `img/`.
3. **Los textos**: abre `project.json` y cambia lo que toque (los campos, abajo). En `photos`,
   cuántas fotos hay.
4. **En el listado**: en `data/site.json`, en `lists`, añade el nombre de la carpeta en su
   categoría (`curadoria`, `mediacio`…), en el sitio donde quieras que salga.
5. **Go Live** para verlo, y después **Subir los cambios**.

**Algo en el listado sin página propia**: un `project.json` con solo `card` (sin `text`): sale
el título sin enlace.

## Los campos de un proyecto (`project.json`)

Su página:

| campo | qué hace |
|---|---|
| `title` | el título grande |
| `year` | el año: `"2025"` o `"2022 - 2025"` |
| `place` | dónde. Puede llevar un enlace: `"<a href='https://…' target='_blank'>la capella</a>"` |
| `city` | la ciudad |
| `text` | el texto, un párrafo por línea, por idioma: `{ "ca": ["…", "…"], "es": […], "en": […] }` |
| `related` | *opcional*: la lista de debajo. `{ "title": "…", "project": "holets" }` lleva a otro proyecto; `{ "title": "…", "url": "https://…" }`, fuera |
| `photos` | cuántas fotos hay en `img/`, sin comillas: `10` |

Su línea en el listado (`card`): `title` (en negrita) y detrás, separados por comas, `place`,
`city`, `summary` (qué es), `role` (qué hiciste) y `year`.

**Un enlace a otro proyecto dentro de un texto**: `<a href='projecte.html?slug=grup-destudi'>Grup d'Estudi</a>`.
En la web publicada se cambia solo por su dirección, en el idioma de la página.

## La home (`data/about.json`)

| campo | qué hace |
|---|---|
| `description` | lo que sale en Google debajo del nombre |
| `subtitle` | las líneas debajo del nombre |
| `links` | los sobres: a qué proyecto llevan y qué pone |
| `bio` | el texto de "sobre mi", un párrafo por línea |
| `cv` | el PDF del cv (en `data/arxius/`) y el texto del enlace |
| `services` | "puc ajudar-te a:", las palabras grandes y el párrafo de debajo |
| `contact` | los correos y los instagram (sin @) |

## Verlo antes de subirlo

**Go Live** abajo a la derecha de VS Code. Se abre la web en el navegador y se refresca sola
cada vez que guardas. Para verla en otro idioma, el selector de arriba (CAT · ES · EN). Si hay
algo que no se publicaría (una coma, un campo mal escrito), sale en pantalla, y dice dónde.

## Subir los cambios

1. Pestaña **Control de código fuente** (las tres bolitas unidas, a la izquierda).
2. Escribe qué has hecho (`proyecto nuevo: nuevo`) y **Confirmar** (*Commit*). Si pregunta si
   quieres añadir todos los cambios: **Sí**.
3. **Sincronizar cambios** (*Sync*).
4. En un par de minutos está en la web. En GitHub, al lado del último cambio sale una bolita:
   amarilla es que se está publicando, verde que ya está, roja que algo no cuadra.

**Antes de empezar a tocar**, dale también a **Sincronizar**, para bajar lo que haya cambiado.

**Los PDF**: mejor que no pasen de 5 MB (en el Mac, Vista Previa → Archivo → Exportar → filtro
de cuarzo "Reduce File Size").

## Si sale en rojo

La web no se rompe: se queda como estaba hasta que se arregla. Pincha la bolita roja, luego
**Details**, y lee el último mensaje, que dice el fichero y qué pasa:

- **"no es un JSON válido, línea 12"** → casi siempre **una coma**: que falta entre dos cosas,
  o que sobra después de la última. O unas comillas sin cerrar.
- **"\"titol\" no es un campo de aquí (¿mal escrito?). Los que hay: title, year…"** → un
  campo mal escrito: cópialo de la lista que sale en el mensaje.
- **"\"photos\" dice 10, y no encuentro projects/nuevo/img/10.webp"** → hay menos fotos de las
  que dice `photos`, o una con otro nombre.
- **"enlaza al proyecto \"x\", y no está en data/site.json → \"lists\""** → un enlace a un
  proyecto que no existe (o con el nombre mal escrito).
- **"\"lists\" dice \"nuevo\", y no hay ningún projects/nuevo/project.json"** → el nombre de la
  lista y el de la carpeta no son iguales.
