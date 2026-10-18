/* ============================================================
   build.mjs — data/ + projects/ + las páginas (plantillas) → dist/, la
   web tal cual se publica.        node build/build.mjs

   Cada página, en cada idioma, con su dirección y el contenido ya escrito
   (antes lo pintaba el JS y Google veía la página vacía):
     /             /es/             /en/              la home
     /projectes/   /es/projectes/   /en/projectes/    el listado
     /<slug>/      /es/<slug>/      /en/<slug>/       un proyecto
   con su title, description, canonical, hreflang y og:image. Las de antes
   (projecte.html?slug=…&lang=…, index-es.html…) llevan a las nuevas.

   Si algo está mal (una coma, un campo mal escrito, una foto que no está)
   para y dice qué, y no se publica nada: la web se queda como estaba.
   ============================================================ */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, hasPage, homeHtml, links, listHtml, photosOf, pick, projectHtml, slugsOf } from '../script/house.js';
import { leerJSON, validar } from '../script/validar.js';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUT = join(ROOT, 'dist');
const at = (...p) => join(ROOT, ...p);
const fail = (msg) => { console.error(`\n✗ ${msg}\n\nNo se ha publicado nada: la web sigue como estaba.\n`); process.exit(1); };

/* ---------- leer y revisar ---------- */

const read = (rel) => {
  if (!existsSync(at(rel))) fail(`no encuentro ${rel}`);
  try { return leerJSON(readFileSync(at(rel), 'utf8'), rel); } catch (e) { fail(e.message); }
};
const schema = (t) => JSON.parse(readFileSync(at('schema', `${t}.json`), 'utf8'));
const site = read('data/site.json');
const about = read('data/about.json');
const errors = [...validar(site, schema('site'), 'data/site.json'), ...validar(about, schema('about'), 'data/about.json')];
const slugs = errors.length ? [] : slugsOf(site);
const projects = {};
for (const slug of slugs) {
  const rel = `projects/${slug}/project.json`;
  if (projects[slug]) { errors.push(`data/site.json: "${slug}" está dos veces en "lists"`); continue; }
  if (!existsSync(at(rel))) { errors.push(`data/site.json: "lists" dice "${slug}", y no hay ningún ${rel}`); continue; }
  const p = projects[slug] = read(rel);
  const before = errors.length;
  errors.push(...validar(p, schema('project'), rel));
  if (errors.length > before) continue;
  for (const src of photosOf(slug, p)) if (!existsSync(at(src))) errors.push(`${rel}: "photos" dice ${p.photos}, y no encuentro ${src}`);
}
if (!errors.length) {
  if (!site.categories) errors.push('data/site.json: falta "categories"');
  for (const c of Object.keys(site.lists)) if (!site.categories[c]) errors.push(`data/site.json: la categoría "${c}" de "lists" no tiene nombre en "categories"`);
  if (!existsSync(at('data/arxius', about.cv.file))) errors.push(`data/about.json: no encuentro data/arxius/${about.cv.file}`);
  // los enlaces a otros proyectos: que existan y tengan página
  const target = (slug, where) => {
    if (!projects[slug]) errors.push(`${where}: enlaza al proyecto "${slug}", y no está en data/site.json → "lists"`);
    else if (!hasPage(projects[slug])) errors.push(`${where}: enlaza al proyecto "${slug}", que no tiene página (le falta "text")`);
  };
  for (const k of about.links) target(k.project, 'data/about.json');
  const inText = (v, where) => links(JSON.stringify(v), (s) => (target(s, where), ''));
  inText(about, 'data/about.json');
  for (const [slug, p] of Object.entries(projects)) {
    for (const r of p.related || []) if (r.project) target(r.project, `projects/${slug}/project.json`);
    inText(p, `projects/${slug}/project.json`);
  }
}
if (errors.length) fail([...new Set(errors)].join('\n✗ '));
// las carpetas que no salen en "lists" no se publican: se avisa, por si es un olvido
for (const d of readdirSync(at('projects'))) {
  if (existsSync(at('projects', d, 'project.json')) && !projects[d]) console.warn(`⚠ projects/${d} no está en data/site.json → lists: no se publica`);
}

/* Dónde se publica (las dos copias en GitHub Pages: el dominio de Berta está
   en DonDominio apuntando a GitHub, y así no hay que tocarlo). En nuestra
   copia (meowrhino), meowrhino.github.io/<repo>/ y sin indexar; en la de
   Berta, o en local, la raíz con el dominio de site.json → "url", y se
   indexa si lo hay. */
const ours = process.env.GITHUB_REPOSITORY_OWNER === 'meowrhino';
const repo = (process.env.GITHUB_REPOSITORY || '/').split('/')[1];
const BASE = ours ? `/${repo}` : '';
const SITE = ours ? `https://meowrhino.github.io${BASE}` : String(site.url || '').replace(/\/+$/, '');
const INDEX = !ours && !!site.url;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const cut = (s) => (s.length <= 160 ? s : s.slice(0, 157).trimEnd() + '…');
const prefix = (l) => (l === 'ca' ? '' : `${l}/`);
const withPage = slugs.filter((s) => hasPage(projects[s]));

/* ---------- la imagen al compartir, con sharp ---------- */

let sharp = null;
try { sharp = (await import('sharp')).default; } catch (e) {
  console.warn(`⚠ sin sharp (${e.code || e.message}): al compartir sale el saltamontes. Se arregla con: npm ci`);
}
const ogs = new Map();
const ogSources = [['home', 'img/sobreverd_2.webp'], ...withPage.filter((s) => projects[s].photos).map((s) => [s, photosOf(s, projects[s])[0]])];
for (const [key, src] of sharp ? ogSources : []) {
  const cached = at('.cache', 'og', `${key}.jpg`);
  try {
    if (!(existsSync(cached) && statSync(cached).mtimeMs >= statSync(at(src)).mtimeMs)) {
      mkdirSync(dirname(cached), { recursive: true });
      await sharp(at(src)).resize(1104, 534, { fit: 'contain', background: '#ffffff' })
        .extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#ffffff' })
        .flatten({ background: '#ffffff' }).jpeg({ quality: 85, mozjpeg: true }).toFile(cached);
    }
    ogs.set(key, cached);
  } catch (e) {
    console.warn(`⚠ ${src}: sharp no la puede leer (${e.message})`);
  }
}
const ogUrl = (key) => (ogs.has(key) ? `${SITE}/og/${key}.jpg` : ogs.has('home') ? `${SITE}/og/home.jpg` : `${SITE}/img/saltamontes.png`);

/* ---------- las páginas ---------- */

function swap(html, find, replace, file) {
  if (!find.test(html)) fail(`no encuentro ${find} en ${file}: el build lo necesita para escribir las páginas.`);
  return html.replace(find, replace);
}
const BACK = { ca: 'enrere', es: 'atrás', en: 'back' };
const LOCALE = { ca: 'ca_ES', es: 'es_ES', en: 'en_GB' };
const PROJECTES = { ca: 'projectes', es: 'proyectos', en: 'projects' };

// path(l): la dirección de la página en ese idioma, sin la base ("", "es/projectes/"…)
function page(file, l, { path, title, desc, image, robots, fill }) {
  const url = `${SITE}/${path(l)}`;
  let html = readFileSync(at(file), 'utf8');
  html = swap(html, /<html lang="ca">/, `<html lang="${l}" data-built>`, file);
  html = swap(html, /(<meta charset="UTF-8">)/, `$1\n    <base href="${BASE}/">`, file);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, file);
  html = html.replace(/\s*<meta name="description" content="[^"]*">/, '');
  html = swap(html, /(\s*)<\/head>/, `$1  <meta name="description" content="${esc(desc)}">
    <meta name="robots" content="${robots || (INDEX ? 'index,follow' : 'noindex')}">
    <link rel="canonical" href="${esc(url)}">
${LANGS.map((x) => `    <link rel="alternate" hreflang="${x}" href="${esc(`${SITE}/${path(x)}`)}">`).join('\n')}
    <link rel="alternate" hreflang="x-default" href="${esc(`${SITE}/${path('ca')}`)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(site.title)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:locale" content="${LOCALE[l]}">
    <meta name="twitter:card" content="summary_large_image">
</head>`, file);
  html = html.replace(/href="index\.html"/g, `href="${prefix(l) || './'}"`);
  html = html.replace(/(data-i18n="back">)[^<]*/g, `$1${BACK[l]}`);
  return fill(html);
}
const href = (l) => (slug) => `${prefix(l)}${encodeURIComponent(slug)}/`;

const homePage = (l) => page('index.html', l, {
  path: prefix, title: site.title, desc: pick(about.description, l), image: ogUrl('home'),
  fill: (html) => swap(html, /(<div class="container" id="contenido">)[\s\S]*?(\n    <\/div>\n    <script)/,
    `$1${homeHtml(site, about, l, { href: href(l), projectesHref: `${prefix(l)}projectes/`, here: prefix(l) || './' })}$2`, 'index.html'),
});

const listPage = (l) => page('projectes.html', l, {
  path: (x) => `${prefix(x)}projectes/`, title: `${PROJECTES[l]} | ${site.title}`,
  desc: `${PROJECTES[l]}: ${Object.keys(site.lists).map((c) => pick(site.categories[c], l)).join(', ')}`, image: ogUrl('home'),
  fill: (html) => swap(html, /(<section id="projectes-list">)[\s\S]*?(<\/section>)/, `$1${listHtml(site, projects, l, href(l))}$2`, 'projectes.html'),
});

const projectPage = (slug, l) => {
  const p = projects[slug];
  return page('projecte.html', l, {
    path: (x) => `${prefix(x)}${encodeURIComponent(slug)}/`, title: `${plain(pick(p.title, l))} | ${site.title}`,
    desc: cut(plain(pick(p.text, l)[0]) || plain(pick(p.title, l))), image: ogUrl(slug),
    fill: (html) => swap(html, /(<main id="projecte-content">)[\s\S]*?(<\/main>)/, `$1${projectHtml(slug, p, l, href(l))}$2`, 'projecte.html'),
  });
};

// la 404: sin data-built, para que lang.js le ponga el idioma de quien llega
function notFound() {
  let html = readFileSync(at('404.html'), 'utf8');
  html = swap(html, /(<meta charset="UTF-8">)/, `$1\n  <base href="${BASE}/">\n  <meta name="robots" content="noindex">`, '404.html');
  return html.replace(/href="index\.html"/g, 'href="./"');
}

// las direcciones de antes llevan a las nuevas
const redirect = (to) => `<!DOCTYPE html>
<html lang="ca"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>${esc(site.title)}</title>
<script>
  const q = new URLSearchParams(location.search), lang = q.get('lang');
  const pre = lang === 'es' || lang === 'en' ? lang + '/' : '';
  const slug = (q.get('slug') || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  location.replace('${BASE}/' + ${to});
</script></head><body><a href="${BASE}/">${esc(site.title)}</a></body></html>
`;

/* ---------- escribir dist/ ---------- */

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const f of ['css', 'script', 'fonts', 'img', 'data', 'projects']) cpSync(at(f), join(OUT, f), { recursive: true, filter: (x) => !x.endsWith('.DS_Store') });
mkdirSync(join(OUT, 'og'), { recursive: true });
for (const [key, cached] of ogs) cpSync(cached, join(OUT, 'og', `${key}.jpg`));
const write = (path, html) => { mkdirSync(join(OUT, path), { recursive: true }); writeFileSync(join(OUT, path, 'index.html'), html); };
const urls = [];
for (const l of LANGS) {
  write(prefix(l), homePage(l));
  write(`${prefix(l)}projectes`, listPage(l));
  for (const slug of withPage) write(`${prefix(l)}${slug}`, projectPage(slug, l));
  urls.push(prefix(l), `${prefix(l)}projectes/`, ...withPage.map((s) => `${prefix(l)}${encodeURIComponent(s)}/`));
}
writeFileSync(join(OUT, '404.html'), notFound());
writeFileSync(join(OUT, 'projecte.html'), redirect("pre + (slug ? encodeURIComponent(slug) + '/' : '')"));
writeFileSync(join(OUT, 'projectes.html'), redirect("pre + 'projectes/' + location.hash"));
writeFileSync(join(OUT, 'index-es.html'), redirect("'es/'"));
writeFileSync(join(OUT, 'index-en.html'), redirect("'en/'"));
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), INDEX ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync(join(OUT, '.nojekyll'), '');

console.log(`✓ dist/: ${urls.length} páginas (${withPage.length} proyectos × 3 idiomas, home y listado)${INDEX ? ` · se indexa (${SITE})` : ' · sin indexar'}`);
