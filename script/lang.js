// Motor de idiomas compartido por todas las páginas.
// En la web construida (data-built) cada idioma tiene sus direcciones (/,
// /es/, /en/) y la página ya viene en el suyo: lo dice <html lang>, y el
// selector lleva a las otras por sus <link rel="alternate" hreflang>.
// En la vista previa: ?lang= en la URL  >  localStorage  >  catalán (por defecto).
// Los contenidos que falten en un idioma caen automáticamente al catalán,
// así se puede traducir poco a poco sin que nada se rompa.

window.LANG = (function () {
  const IDIOMAS = ["cat", "es", "en"];
  const DEFECTO = "cat";
  const HTML_LANG = { cat: "ca", es: "es", en: "en" };
  const BUILT = document.documentElement.hasAttribute("data-built");

  function resolver() {
    if (BUILT) {
      const l = document.documentElement.lang === "ca" ? "cat" : document.documentElement.lang;
      localStorage.setItem("lang", l);
      return l;
    }
    // ?lang= > localStorage > catalán
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

  // Reescribe los enlaces internos para arrastrar el idioma entre páginas
  // (en la web construida ya vienen bien escritos).
  function reescribirEnlaces(raiz = document) {
    if (BUILT) return;
    raiz.querySelectorAll("a[href]").forEach((a) => {
      // el propio selector de idiomas se gestiona aparte
      if (a.closest(".menu-idiomas")) return;
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;

      const [sinHash, hash = ""] = href.split("#");
      let [file, query = ""] = sinHash.split("?");
      const params = new URLSearchParams(query);

      const esInterna = /^(index\.html|projectes\.html|projecte\.html)$/.test(file);
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
    if (BUILT) {
      const alt = document.querySelector(`link[rel="alternate"][hreflang="${HTML_LANG[l]}"]`);
      return (alt ? new URL(alt.href).pathname : "./") + location.hash; // la misma ruta en este dominio
    }
    const file = location.pathname.split("/").pop() || "index.html";
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

  return { actual, reescribirEnlaces, aplicar };
})();
