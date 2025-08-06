# TODO - Nueva web Berta Esteve

## 0. Limpieza y base
- [x] Vaciar proyecto antiguo y dejar solo assets que interesen.
- [x] Crear carpetas `/data`, `/components`, `/assets`.

## 1. Datos y estructura
- [x] Crear `main_cat.json` con la estructura de secciones.
- [x] Crear carpeta `proyectos_cat` con un JSON por proyecto (un archivo por proyecto en catalán).
- [x] Establecer convención de nombres y rutas para enlaces automáticos (campo `slug` y rutas como `projectes_cat/slug.json`).
- [x] Dejar preparado el esqueleto para futuros idiomas (`main_es.json`, `main_en.json` y `proyectos_es/`, `proyectos_en/`), pero sin rellenar todavía.

## 2. Renderizado modular
- [x] Crear script JS que cargue el JSON según idioma (ahora solo catalán) y pinte la página principal (`render.js`).
- [x] Crear componentes para cada tipo de sección: texto, grid, galería, etc. *(Esto lo tienes en el render modular por tipo; si creces puedes separar en más funciones, pero de momento va perfecto)*
- [ ] Añadir detección/selector de idioma (opcional, por ahora solo visible catalán, pero dejar preparado para futuro). *(Pendiente, pero no prioritario)*

## 3. Navegación y enlaces
- [x] Helper JS para generar enlaces dinámicos según idioma y estructura. *(Con el uso de slugs y generación de hrefs, esto está cubierto)*
- [x] Asegurar que los enlaces de proyectos y otras páginas funcionan bien (de momento, solo catalán).

## 4. Multiidioma (fase futura)
- [ ] Cuando se añadan español e inglés, duplicar estructura (`main_es.json`, `main_en.json`, etc).
- [ ] Asegurar que el contenido y los enlaces cambian bien al cambiar de idioma.
- [ ] Comprobar que el sistema es escalable (añadir/quitar proyectos, secciones, etc).

## 5. Extras (cuando la base esté)
- [ ] Mejorar estilos y animaciones.
- [ ] Optimizar carga de imágenes.
- [ ] Añadir SEO básico para cada idioma.