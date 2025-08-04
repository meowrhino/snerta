# TODO - Web de Berta Esteve

## 1. Estado actual (hecho / pendiente)
- [x] index.html: sección de proyectos convertida en enlaces a projectes.html con anchors.  
- [x] Corrección de enlaces de Instagram añadiendo `https://`.  
- [ ] Crear `projectes.html` (listado dinámico de proyectos).  
- [ ] Crear `projectes.json` con entradas de proyectos extraídas de los docx.  
- [ ] Implementar / ajustar `projectes.js` para cargar el JSON y renderizar.  
- [ ] Asegurar consistencia de IDs contenedores (`container-projectes` vs `container-projecte`).  
- [ ] Integrar y verificar el popup de imágenes (markup y accesibilidad).  
- [ ] Decidir y limpiar los scripts de idiomas (eliminar duplicados y limpiar logs).  
- [ ] Fusionar estilos de `notused.css` en `style.css` y eliminar redundancias.  
- [ ] Validar responsive y accesibilidad (alt text, foco, navegación por teclado).

## 2. Crear página de proyectos (`projectes.html`)
- [ ] Esqueleto base con contenedor donde se inyectan proyectos, por ejemplo:
  ```html
  <div id="container-projectes"></div>