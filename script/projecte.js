document.addEventListener("DOMContentLoaded", function () {
    fetch('data/projectes.json')
    .then(response => response.json())
    .then(projectes => {
        let container = document.getElementById('container-projectes');

        projectes.forEach(proj => {
            // Crear estructura dinámica solo si existe cada elemento
            let html = `<section id="${proj.id}" class="projecte">`;

            if(proj.titulo) html += `<h2>${proj.titulo}</h2>`;
            if(proj.ficha_tecnica) html += `<p class="ficha-tecnica">${proj.ficha_tecnica}</p>`;
            if(proj.imagen_principal) html += `<img src="${proj.imagen_principal}" alt="${proj.titulo}" class="imagen-principal">`;
            if(proj.sinopsis) html += `<p>${proj.sinopsis}</p>`;

            if(proj.texto1) html += `<div class="texto1">${proj.texto1}</div>`;

            if(proj.galeria && proj.galeria.length > 0) {
                html += `<div class="galeria">`;
                proj.galeria.forEach(img => {
                    html += `<img src="${img}" alt="Imagen de galería">`;
                });
                html += `</div>`;
            }

            if(proj.texto2) html += `<div class="texto2">${proj.texto2}</div>`;

            if(proj.proyectos_relacionados && proj.proyectos_relacionados.length > 0) {
                html += `<ul class="relacionados">`;
                proj.proyectos_relacionados.forEach(rel => {
                    html += `<li><a href="${rel.link}">${rel.titulo}</a></li>`;
                });
                html += `</ul>`;
            }

            html += `</section>`;
            container.innerHTML += html;
        });
    });
});