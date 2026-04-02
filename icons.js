/*!
 * icons.js – Fügt die zwei Icons (Hilfe / Menü) in jede Level-Seite ein.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VERWENDUNG in jeder Level-HTML-Datei (vor </body> einfügen):
 *
 *    <script>
 *      window.LEVEL_CONFIG = {
 *        hilfeUrl: 'hilfe_LEVELNAME.html',  // ← hier den Level-Namen anpassen
 *        menuUrl:  'leveluebersicht.html',  // ← für alle Level gleich
 *      };
 *    </script>
 *    <script src="icons.js"></script>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  var cfg = window.LEVEL_CONFIG || {};
  var hilfeUrl = cfg.hilfeUrl || null;
  var menuUrl = cfg.menuUrl || "levels.html";

  /* ═══════════════════════════════════════════════════════════════════
     SVG-Pfaddaten (aus Icon.svg, ViewBox 0 0 1600 900)
  ═══════════════════════════════════════════════════════════════════ */

  // Icon 2 – Hilfe / Fragezeichen
  var D_HILFE_BG =
    "M1430.2,46.5c-4.9,10.4-2.1,39,15.3,42.5,17.1,3.4,29.5,1.9,38.5-15,4.1-9.6,3.5-18-.9-26.4-4.5-8.7-8.3-16-20.9-16.8s-27.1,5.3-32,15.7Z";
  var D_HILFE_Q =
    "M1447.9,52c0-17,22.6-18.9,22.6-1.1s-10.9,5.7-13.2,13.5c-.7,2.6-.4,8.3-.4,8.3";
  var D_HILFE_DOT =
    "M1459.7,78.5c-3.6-3.6-8.7,2.4-4.7,6.4,3.2,3.2,7.9-3.1,4.7-6.4Z";

  // Icon 3 – Menü / Hamburger
  var D_MENU1 = "M1575.7,42.4c-20.1.7-41.5-.5-61.7.3";
  var D_MENU2 = "M1575.7,59.9c-23.1,1.9-41,.7-61.7,0";
  var D_MENU3 = "M1575.7,78.8c-20.8,0-40.9-1.9-61.7,0";

  /* ═══════════════════════════════════════════════════════════════════
     Hilfsfunktionen
  ═══════════════════════════════════════════════════════════════════ */
  var NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        e.setAttribute(k, attrs[k]);
      }
    }
    return e;
  }

  function makePath(d, cls) {
    return svgEl("path", { d: d, class: cls });
  }

  /* ═══════════════════════════════════════════════════════════════════
     Hover-Verhalten per JS – kein CSS-Cascade-Konflikt möglich
     Färbt alle Kind-Pfade auf mouseenter ein, stellt sie auf mouseleave
     wieder her (inline style wird einfach gelöscht → CSS-Wert kommt zurück)
  ═══════════════════════════════════════════════════════════════════ */
  function addHover(btn) {
    var paths = Array.prototype.slice.call(btn.querySelectorAll("path"));
    btn.addEventListener("mouseenter", function () {
      paths.forEach(function (p) {
        p.style.fill = "rgba(65,65,65,0.7)";
      });
    });
    btn.addEventListener("mouseleave", function () {
      paths.forEach(function (p) {
        p.style.fill = "";
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icon 2: Hilfe – führt zur level-spezifischen Hilfeseite
  ═══════════════════════════════════════════════════════════════════ */
  function buildHilfe(href) {
    var a = svgEl("a", {
      id: "hilfe-btn",
      href: href,
      role: "button",
      "aria-label": "Hilfe",
    });
    a.appendChild(makePath(D_HILFE_BG, "str2")); // weißer Kreis
    a.appendChild(makePath(D_HILFE_Q, "str0")); // Fragezeichen
    a.appendChild(makePath(D_HILFE_DOT, "str6")); // Punkt
    return a;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icon 3: Menü / Levelübersicht
  ═══════════════════════════════════════════════════════════════════ */
  function buildMenu(href) {
    var a = svgEl("a", {
      id: "menu-btn",
      href: href,
      role: "button",
      "aria-label": "Levelübersicht",
    });
    // Rechteck-Hintergrund
    // pointer-events als inline style gesetzt → überschreibt #menu-btn .st6 { pointer-events:none } aus CSS
    var rect = svgEl("rect", {
      class: "str6",
      x: "1507.6",
      y: "32.2",
      width: "73.6",
      height: "56.8",
      rx: "5.5",
      ry: "5.5",
    });
    rect.style.pointerEvents = "all";
    a.appendChild(rect);
    a.appendChild(makePath(D_MENU1, "str0"));
    a.appendChild(makePath(D_MENU2, "str0"));
    a.appendChild(makePath(D_MENU3, "str0"));
    return a;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icons in die Seite einfügen
  ═══════════════════════════════════════════════════════════════════ */
  function inject() {
    // Bevorzugt: Icons in die vorhandene room-overlay SVG einhängen
    // (gleiche ViewBox 0 0 1600 900 → Icons erscheinen automatisch richtig positioniert)
    var target = document.querySelector("svg.room-overlay");

    if (!target) {
      // Fallback: eigenes festes SVG-Element erzeugen
      target = svgEl("svg", {
        viewBox: "0 0 1600 900",
        preserveAspectRatio: "xMidYMid meet",
      });
      target.style.cssText = [
        "position:fixed",
        "top:0",
        "left:0",
        "width:100%",
        "height:100%",
        "pointer-events:none",
        "z-index:50",
      ].join(";");
      document.body.appendChild(target);
      // Klickbare Elemente brauchen pointer-events wieder
      target.addEventListener("click", function () {});
    }

    // Icons in Gruppen-Container
    var iconGroup = svgEl("g", { id: "icon-bar" });
    if (hilfeUrl) {
      iconGroup.appendChild(buildHilfe(hilfeUrl));
    }
    iconGroup.appendChild(buildMenu(menuUrl));

    target.appendChild(iconGroup);

    // JS-Hover für Icon 2
    var hilfeEl = target.querySelector("#hilfe-btn");
    if (hilfeEl) addHover(hilfeEl);

    // Wenn Fallback-SVG: pointer-events für <a>-Elemente aktivieren
    if (!document.querySelector("svg.room-overlay")) {
      target.querySelectorAll("a").forEach(function (a) {
        a.style.pointerEvents = "all";
      });
    }
  }

  // Warten bis DOM fertig geladen ist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();

// ── Icons keyboard-zugänglich machen ────────────────────────────────────
// icons.js rendert die Buttons; wir warten bis sie im DOM sind.
window.addEventListener("load", () => {
  const cfg = window.LEVEL_CONFIG || {};
  const iconMap = {
    "hilfe-btn": cfg.hilfeUrl,
    "menu-btn": cfg.menuUrl,
  };

  Object.entries(iconMap).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el) return;

    // In Tab-Reihenfolge aufnehmen
    el.setAttribute("tabindex", "0");

    // Enter / Leertaste lösen Navigation aus
    // (click wird auf dieser Seite geblockt → keydown nötig)
    if (url) {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = url;
        }
      });
    }
  });
});
