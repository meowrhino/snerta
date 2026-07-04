// Motor de idiomas compartido por todas las páginas.
// Idioma actual = ?lang= en la URL  >  localStorage  >  catalán (por defecto).
// Los contenidos que falten en un idioma caen automáticamente al catalán,
// así se puede traducir poco a poco sin que nada se rompa.

window.LANG = (function () {
  const IDIOMAS = ["cat", "es", "en"];
  const DEFECTO = "cat";
  const HTML_LANG = { cat: "ca", es: "es", en: "en" };

  function resolver() {
    // En las home estáticas manda el propio archivo (index-es.html => es, etc.)
    const file = location.pathname.split("/").pop() || "index.html";
    const home = file.match(/^index-(es|en)\.html$/);
    if (home) {
      localStorage.setItem("lang", home[1]);
      return home[1];
    }
    if (file === "index.html") {
      localStorage.setItem("lang", "cat");
      return "cat";
    }
    // Resto de páginas: ?lang= > localStorage > catalán
    const enUrl = new URLSearchParams(location.search).get("lang");
    if (enUrl && IDIOMAS.includes(enUrl)) {
      localStorage.setItem("lang", enUrl);
      return enUrl;
    }
    const guardado = localStorage.getItem("lang");
    return IDIOMAS.includes(guardado) ? guardado : DEFECTO;
  }

  const actual = resolver();
  document.documentElement.lang = HTML_LANG[actual];

  // Cadenas de interfaz fijas (elementos con data-i18n="clave")
  const I18N = {
    back: { cat: "enrere", es: "atrás", en: "back" },
    notfound: {
      cat: "ups! encara no ho he fet 🤡",
      es: "¡ups! aún no lo he hecho 🤡",
      en: "oops! i haven't done it yet 🤡"
    }
  };
  function traducirUI() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const dic = I18N[el.getAttribute("data-i18n")];
      if (dic) el.textContent = dic[actual] || dic.cat;
    });
  }

  // Archivo de home según idioma
  function homeHref() {
    return actual === "cat" ? "index.html" : `index-${actual}.html`;
  }

  // Carga un JSON probando el idioma actual y, si falla, el catalán.
  // builder: función (idioma) => ruta del JSON
  async function cargar(builder) {
    for (const l of actual === "cat" ? ["cat"] : [actual, "cat"]) {
      try {
        const res = await fetch(builder(l));
        if (res.ok) return await res.json();
      } catch (e) {
        /* probamos el siguiente */
      }
    }
    return null;
  }

  // Reescribe los enlaces internos para arrastrar el idioma entre páginas.
  function reescribirEnlaces(raiz = document) {
    raiz.querySelectorAll("a[href]").forEach((a) => {
      // el propio selector de idiomas se gestiona aparte
      if (a.closest(".menu-idiomas")) return;
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;

      const [sinHash, hash = ""] = href.split("#");
      let [file, query = ""] = sinHash.split("?");
      const params = new URLSearchParams(query);

      // index.html -> home del idioma
      if (file === "index.html") file = homeHref();

      const esInterna = /^(index(-es|-en)?\.html|projectes\.html|projecte\.html)$/.test(file);
      if (esInterna) {
        if (actual !== "cat") params.set("lang", actual);
        else params.delete("lang");
      }

      const q = params.toString();
      a.setAttribute("href", file + (q ? "?" + q : "") + (hash ? "#" + hash : ""));
    });
  }

  // URL de la página actual en otro idioma (para el selector).
  function urlEnIdioma(l) {
    let file = location.pathname.split("/").pop() || "index.html";
    if (/^index(-es|-en)?\.html$/.test(file)) {
      return l === "cat" ? "index.html" : `index-${l}.html`;
    }
    const params = new URLSearchParams(location.search);
    if (l === "cat") params.delete("lang");
    else params.set("lang", l);
    const q = params.toString();
    return file + (q ? "?" + q : "") + location.hash;
  }

  // Selector CAT/ES/EN fijo arriba a la derecha.
  function pintarSelector() {
    if (document.querySelector(".menu-idiomas")) return;
    const menu = document.createElement("div");
    menu.className = "menu-links menu-arriba menu-idiomas";
    IDIOMAS.forEach((l) => {
      const a = document.createElement("a");
      a.href = urlEnIdioma(l);
      a.textContent = l === "cat" ? "CAT" : l.toUpperCase();
      if (l === actual) a.classList.add("active");
      menu.appendChild(a);
    });
    document.body.appendChild(menu);
  }

  function aplicar() {
    pintarSelector();
    traducirUI();
    reescribirEnlaces();
  }

  document.addEventListener("DOMContentLoaded", aplicar);

  return { actual, homeHref, cargar, reescribirEnlaces, aplicar };
})();
