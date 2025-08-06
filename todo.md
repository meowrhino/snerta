# TODO - Web Berta Esteve (Actualizado 2025-08-06)

## 0. Arquitectura y flujo actual

- [x] `index.html` es estático y se edita a mano (no se genera dinámicamente). El contenido de la home se mantiene en HTML, aunque los datos y estructura están en `main_cat.json` y el script `renderHome.js` (puede usarse para una futura versión generada).
- [x] Carpeta `/data` contiene todos los JSON: `main_cat.json`, `projectes_cat.json`, y una carpeta `proyectos_cat/` con un `.json` individual por cada proyecto.
- [x] Carpeta `/assets` contiene todas las imágenes.

## 1. Gestión de proyectos (flujo recomendado y fácil para Berta)

- [x] El listado de proyectos se gestiona SOLO en `projectes_cat.json` (cada item tiene `slug`, `titol`, `categoria`, `any`, `imatge`, `sinopsi`...).
- [x] El detalle de cada proyecto se gestiona en su propio archivo: `/data/proyectos_cat/[slug].json`.
- [x] Las imágenes se suben a `/assets` y se referencian desde los JSON.
- [ ] Escribir un mini README para Berta explicando:  
  - Cómo añadir un nuevo proyecto  
  - Cómo modificar uno existente  
  - Cómo subir imágenes  
  - Qué campos debe tener cada JSON

## 2. Página de proyectos (`projectes.html`)

- [x] Usa `renderProjectes.js` para cargar y mostrar el grid/listado de proyectos a partir de `projectes_cat.json`.
- [ ] Mejorar el CSS para el grid de proyectos.
- [ ] Agrupar visualmente por categoría si interesa (opcional/futuro).

## 3. Página de proyecto individual (`projecte.html`)

- [x] Usa `projecte.js` para mostrar el detalle del proyecto, cargando los datos de `/data/proyectos_cat/[slug].json`.
- [ ] Mejorar el CSS para la página de detalle del proyecto.
- [ ] Añadir navegación fácil a "proyectos relacionados" (usando slugs).

## 4. Limpieza y eliminación de redundancias

- [x] Eliminar archivos JSON duplicados o en desuso (`projectes.json` antiguo, etc).
- [ ] Revisar scripts y eliminar/comentar los que no se usen (ejemplo: `render.js` viejo para home si no se usa).

## 5. Añadir nuevos proyectos

- [ ] Añadir el primer y segundo proyecto en `projectes_cat.json` y como `.json` detallado en `/data/proyectos_cat/`.
- [ ] Subir las imágenes necesarias a `/assets/`.
- [ ] Probar todo el flujo: listado, enlace, y página de detalle.

## 6. Mejoras visuales y otros extras

- [ ] Mejorar animaciones y estilos (cuando todo funcione bien).
- [ ] Optimizar carga de imágenes si hay muchas.
- [ ] SEO básico en todas las páginas.
- [ ] Dejar preparado el esqueleto para multiidioma (bastará con duplicar los JSON y adaptar los scripts).

---

**Resumen rápido flujo Berta:**  
1. Editar `projectes_cat.json` para añadir/editar/quitar proyectos.  
2. Crear un `.json` detallado por cada proyecto en `/data/proyectos_cat/`.  
3. Subir imágenes a `/assets/`.  
4. ¡Ya sale en la web!  
5. Para borrar o modificar, solo toca el JSON correspondiente.

---