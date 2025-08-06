async function cargarDatos(url) {
  const res = await fetch(url);
  return await res.json();
}

function renderSection(section) {
  switch (section.type) {
    case "title":
      return `<section id="berta"><h1>${section.content}</h1></section>`;
    case "text":
      return `<section id="descripcio">${
        section.content.map(p => `<p>${p}</p>`).join('')
      }</section>`;
    case "sections":
      return `<section id="projectes">${
        section.items.map(item =>
          `<h4><a href="projectes.html${item.anchor}">${item.label}</a></h4>`
        ).join('')
      }</section>`;
    case "acompanyaments":
      return `<section id="acompanyaments">
        <h3>${section.title}</h3>
        <ul>${section.list.map(li => `<li>${li}</li>`).join('')}</ul>
        <p>${section.info}</p>
        <div class="image-gallery">${
          section.gallery.map(src => `<img src="${src}" style="width:350px;height:185px;object-fit:cover;background-color:grey;" />`).join('')
        }</div>
      </section>`;
    case "contacte":
      return `<section id="contacte">
        <h4><a href="mailto:${section.email}">${section.email}</a></h4>
        <div class="contacte-llinks">
          ${section.links.map(l => `<h5><a href="${l.url}">${l.label}</a></h5>`).join('')}
        </div>
      </section>`;
    default:
      return "";
  }
}

async function renderHome() {
  const data = await cargarDatos('data/main_cat.json');
  const container = document.querySelector('.container');
  container.innerHTML = data.map(renderSection).join('') +
    container.innerHTML; // Para mantener los menús flotantes que ya tienes
}

document.addEventListener('DOMContentLoaded', renderHome);