/* house.js — pinta la home, el listado y la ficha de un proyecto a partir de
   data/site.json, data/about.json y projects/<slug>/project.json, en cada
   idioma. Lo usan el build (las páginas, ya escritas) y script/pagina.js
   (la vista previa, sin build): el mismo HTML que pintaban antes
   renderProjectes.js, renderProjecte.js e index.html. No toca el disco.

   href(slug) da la dirección de un proyecto: en la web construida,
   /<idioma>/<slug>/; en la vista previa, projecte.html?slug=<slug>. */

export const LANGS = ['ca', 'es', 'en'];

// un texto igual en todos los idiomas, o { ca, es, en } (lo que falte, en catalán)
export const pick = (v, l) => (v == null ? '' : typeof v !== 'object' || Array.isArray(v) ? v : v[l] ?? v.ca ?? '');

export const slugsOf = (site) => Object.values(site.lists).flat();
export const hasPage = (p) => !!p.text;
const accents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// los enlaces que se escriben a mano en los textos: projecte.html?slug=x → su dirección
export const links = (html, href) => String(html).replace(/projecte\.html\?slug=([^'"\s>&#\\]+)/g, (_, s) => href(accents(decodeURIComponent(s))));

// lo que no es contenido: los textos fijos de la home (de home_translations.json)
const UI = {
  descripcio: { ca: 'descripció de la berta', es: 'descripción de berta', en: 'about berta' },
  acompanyaments: { ca: 'què pot fer la berta per tu', es: 'qué puede hacer berta por ti', en: 'what berta can do for you' },
  contacte: { ca: 'contacta amb la berta', es: 'contacta con berta', en: 'get in touch with berta' },
  menu: {
    ca: ['berta', 'sobre mi', 'projectes', 'acompanyaments', 'contacte'],
    es: ['berta', 'sobre mí', 'proyectos', 'acompañamientos', 'contacto'],
    en: ['berta', 'about me', 'projects', 'mentoring', 'contact'],
  },
};
const SOBRES = ['sobreverd_3', 'sobreverd_2', 'sobreverd_3', 'sobreverd_4'];

/* ---------- la home ---------- */

export function homeHtml(site, about, l, { href, projectesHref, here = '' }) {
  const t = (v) => links(pick(v, l), href);
  const [m0, m1, m2, m3, m4] = UI.menu[l];
  return `
        <section id="berta">
            <h1>${site.title}</h1>
            <div class="berta-links">
${about.links.map((k, i) => `                <a href="${href(k.project)}" class="link-sobre sobre${i + 1}">
                    <img src="img/${SOBRES[i] || SOBRES[0]}.webp" alt="" class="bg-sobre" />
                    ${t(k.text)}
                </a>`).join('\n')}
            </div>
            <div class="berta-subtext">
${pick(about.subtitle, l).map((s) => `                <p>${s}</p>`).join('\n')}
            </div>
        </section>
        <section id="descripcio" aria-label="${UI.descripcio[l]}">
${pick(about.bio, l).map((p) => `            <p>${links(p, href)}</p>`).join('\n')}
            <a href="data/arxius/${about.cv.file}" target="_blank">☆.。.: ${t(about.cv.text)} ☆.。.:</a>
        </section>
        <section id="projectes">
${Object.keys(site.lists).map((c) => `            <h4><a href="${projectesHref}#${c}">${pick(site.categories[c], l)}</a></h4>`).join('\n')}
        </section>
        <section id="acompanyaments" aria-label="${UI.acompanyaments[l]}">
            <h3>${t(about.services.title)}</h3>
            <ul class="serveis-grid">
${pick(about.services.items, l).map((s) => `                <li>
                    <h4>${s}</h4>
                </li>`).join('\n')}
            </ul>
            <p>${t(about.services.text)}</p>
        </section>
        <section id="contacte" aria-label="${UI.contacte[l]}">
            <ul class="contacte-grid">
${about.contact.map((c) => `                <li>
                    <a href="mailto:${c.email}">${c.email}</a> <br>
                    <h5><a href="https://instagram.com/${c.instagram}">@${c.instagram}</a></h5>
                </li>`).join('\n')}
            </ul>
            <div class="meowrhino">
                <small>web: <a href="https://meowrhino.studio/">meowrhino</a></small>
            </div>
        </section>
        <div class="menu-links menu-abajo">
            <a href="${here}#berta">${m0}</a>
            <a href="${here}#descripcio">${m1}</a>
            <a href="${here}#projectes">${m2}</a>
            <a href="${here}#acompanyaments">${m3}</a>
            <a href="${here}#contacte">${m4}</a>
        </div>
`;
}

/* ---------- el listado (projectes) ---------- */

function linea(slug, p, l, href) {
  const c = p.card;
  const text = [c.place, c.city, c.summary, c.role, c.year].map((v) => pick(v, l)).filter(Boolean).join(', ');
  const title = pick(c.title, l);
  const titol = hasPage(p)
    ? `<a href="${href(slug)}" class="projecte-link"><strong>${title}</strong></a>`
    : `<strong>${title}</strong>`;
  return `
    <div class="projecte-linia">
      ${titol}${text ? ', ' + text : ''}
    </div>
  `;
}

export function listHtml(site, projects, l, href) {
  return Object.entries(site.lists).map(([cat, slugs]) => {
    if (!slugs.length) return '';
    return `
      <section class="projectes" id="${cat}">
        <h2>${pick(site.categories[cat], l)}</h2>
        <div class="projectes-col">
          ${slugs.map((s) => linea(s, projects[s], l, href)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

/* ---------- la ficha de un proyecto ---------- */

export const photosOf = (slug, p) => Array.from({ length: p.photos || 0 }, (_, i) => `projects/${slug}/img/${i + 1}.webp`);

export function projectHtml(slug, p, l, href) {
  const t = (v) => links(pick(v, l), href);
  let html = `<h1>${pick(p.title, l)}</h1>`;
  if (p.year) html += `<div class="projecte-any">${pick(p.year, l)}</div>`;
  const where = [t(p.place), t(p.city)].filter(Boolean);
  if (where.length) html += `<div class="projecte-lloc-ciutat">${where.join(' · ')}</div>`;
  html += `<div class="text">${pick(p.text, l).map((x) => `<p>${links(x, href)}</p>`).join('')}</div>`;
  if (p.related?.length) {
    html += `<div class="projectes-relacionats"><ul>`;
    for (const r of p.related) {
      const title = pick(r.title, l);
      if (r.url) html += `<li><a href="${r.url}" target="_blank">${title}</a></li>`;
      else if (r.project) html += `<li><a href="${href(r.project)}">${title}</a></li>`;
      else html += `<li>${title}</li>`;
    }
    html += `</ul></div>`;
  }
  const photos = photosOf(slug, p);
  if (photos.length) {
    html += `<div class="galeria">` + photos.map((src, idx) => `<img src="${src}" data-idx="${idx}" alt="" loading="lazy" decoding="async">`).join('') + `</div>`;
  }
  return html;
}
