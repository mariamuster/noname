/*!
 * icons.js – Fügt die drei Icons (WCAG / Hilfe / Menü) in jede Level-Seite ein.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VERWENDUNG in jeder Level-HTML-Datei (vor </body> einfügen):
 *
 *    <script>
 *      window.LEVEL_CONFIG = {
 *        hilfeUrl: 'hilfe_LEVELNAME.html',  // ← hier den Level-Namen anpassen
 *        menuUrl:  'leveluebersicht.html',  // ← für alle Level gleich
 *        wcagUrl:  'info_LEVELNAME.html'    // ← optional: macht Icon 1 aktiv (Link)
 *                                           //   weglassen → Icon 1 bleibt inaktiv
 *      };
 *    </script>
 *    <script src="icons.js"></script>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Farbe des WCAG-Icons per CSS-Variable im Level setzen:
 *    <style> :root { --wcag-farbe: #ff0; } </style>   ← gelb
 *    <style> :root { --wcag-farbe: #2323ff; } </style> ← blau (Standard)
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  var cfg      = window.LEVEL_CONFIG || {};
  var hilfeUrl = cfg.hilfeUrl || null;
  var menuUrl  = cfg.menuUrl  || 'levels.html';
  var wcagUrl  = cfg.wcagUrl  || null;   // optional: wenn gesetzt → Icon 1 aktiv

  /* ═══════════════════════════════════════════════════════════════════
     SVG-Pfaddaten (aus Icon.svg, ViewBox 0 0 1600 900)
  ═══════════════════════════════════════════════════════════════════ */

  // Icon 1 – WCAG / Info (Figur + Augen)
  var D_WCAG_BODY = 'M1362.7,65.6c-4.2-6.5-6.5-8.1-8.8-15.1-4.7-11.9,8.4-24.6,20.7-25.3,15.1-3.2,27.6,14.6,21.9,28.3-2.1,6.1-9.6,9.5-9,16.5v5c.2,4.3-.7,8.6-.7,12.9s.6,5.2-.5,7.5c-.5,1-1.5,1-2,0-1-2.1-.6-4.7-.7-7.1,0-2.6,0-5.5,0-8.1,0,0-1.2-.2-1.4-.2-.4,0-1,.2-1.2,0,0,3.8.3,7.8,0,11.7,0,1.7,0,5-1.9,4.5-2.5-1.2-.7-13.2-1.1-16.3-.6-.2-1.9-.4-2.5-.4.4,2.3-.3,5.1-.4,7.4,0,2.5.5,5.1,0,7.6-.4,2.1-2.1,2.4-2.5.2-.9-4.6,0-9.8-.3-14.5-.3-.2-1.7-.4-2.1-.3-.5,4.6-.2,9.5-.4,14.1-.3,2.3-2.6,2.4-3,0-.4-4.8-.4-9.8-.3-14.6,0,0-2-11-3.8-13.9Z';
  var D_WCAG_MOUTH = 'M1378.9,58.8c-1.9,1.7-3.2,1.5-5.5-.5';
  var D_WCAG_EYE_L = 'M1369.9,43.9c-1-1.5-4.1-3.4-6.5-2.7-4,1.4-5.9,7.2-2.7,10.3,2.5,2.6,7.6,2.6,9.4-.8,1.2-2,.8-5.4-.2-6.8h0Z';
  var D_WCAG_EYE_R = 'M1382.4,52.8c1.9,2.2,5.8,2.1,8,.5,2.1-2.1,3.6-5.7,1.3-8.3-5.4-6.2-14.3,1.2-9.3,7.8Z';

  // Icon 2 – Hilfe / Fragezeichen
  var D_HILFE_BG  = 'M1430.2,46.5c-4.9,10.4-2.1,39,15.3,42.5,17.1,3.4,29.5,1.9,38.5-15,4.1-9.6,3.5-18-.9-26.4-4.5-8.7-8.3-16-20.9-16.8s-27.1,5.3-32,15.7Z';
  var D_HILFE_Q   = 'M1447.9,52c0-17,22.6-18.9,22.6-1.1s-10.9,5.7-13.2,13.5c-.7,2.6-.4,8.3-.4,8.3';
  var D_HILFE_DOT = 'M1459.7,78.5c-3.6-3.6-8.7,2.4-4.7,6.4,3.2,3.2,7.9-3.1,4.7-6.4Z';

  // Icon 3 – Menü / Hamburger
  var D_MENU1 = 'M1575.7,42.4c-20.1.7-41.5-.5-61.7.3';
  var D_MENU2 = 'M1575.7,59.9c-23.1,1.9-41,.7-61.7,0';
  var D_MENU3 = 'M1575.7,78.8c-20.8,0-40.9-1.9-61.7,0';

  /* ═══════════════════════════════════════════════════════════════════
     Hilfsfunktionen
  ═══════════════════════════════════════════════════════════════════ */
  var NS = 'http://www.w3.org/2000/svg';

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
    return svgEl('path', { d: d, 'class': cls });
  }

  /* ═══════════════════════════════════════════════════════════════════
     Hover-Verhalten per JS – kein CSS-Cascade-Konflikt möglich
     Färbt alle Kind-Pfade auf mouseenter ein, stellt sie auf mouseleave
     wieder her (inline style wird einfach gelöscht → CSS-Wert kommt zurück)
  ═══════════════════════════════════════════════════════════════════ */
  function addHover(btn) {
    var paths = Array.prototype.slice.call(btn.querySelectorAll('path'));
    btn.addEventListener('mouseenter', function () {
      paths.forEach(function (p) { p.style.fill = 'rgba(65,65,65,0.7)'; });
    });
    btn.addEventListener('mouseleave', function () {
      paths.forEach(function (p) { p.style.fill = ''; });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icon 1: WCAG / Info
     – ohne wcagUrl: inaktiv (halbtransparent, kein Klick)
     – mit wcagUrl:  aktiver Link (volle Deckkraft, klickbar)
  ═══════════════════════════════════════════════════════════════════ */
  function buildWcag(href) {
    var container;
    if (href) {
      // Aktiver Button mit Link
      container = svgEl('a', {
        id:           'wcag-btn',
        href:         href,
        role:         'button',
        'aria-label': 'Info'
      });
    } else {
      // Inaktiv
      container = svgEl('g', { id: 'wcag-btn', 'aria-hidden': 'true' });
      container.style.cssText = 'opacity:0.4; pointer-events:none;';
    }
    container.appendChild(makePath(D_WCAG_BODY,  'wcag-body'));
    container.appendChild(makePath(D_WCAG_MOUTH, 'str3'));
    container.appendChild(makePath(D_WCAG_EYE_L, 'str5'));
    container.appendChild(makePath(D_WCAG_EYE_R, 'str5'));
    return container;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icon 2: Hilfe – führt zur level-spezifischen Hilfeseite
  ═══════════════════════════════════════════════════════════════════ */
  function buildHilfe(href) {
    var a = svgEl('a', {
      id:           'hilfe-btn',
      href:         href,
      role:         'button',
      'aria-label': 'Hilfe'
    });
    a.appendChild(makePath(D_HILFE_BG,  'str2'));          // weißer Kreis
    a.appendChild(makePath(D_HILFE_Q,   'str0'));          // Fragezeichen
    a.appendChild(makePath(D_HILFE_DOT, 'str6'));          // Punkt
    return a;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icon 3: Menü / Levelübersicht
  ═══════════════════════════════════════════════════════════════════ */
  function buildMenu(href) {
    var a = svgEl('a', {
      id:           'menu-btn',
      href:         href,
      role:         'button',
      'aria-label': 'Levelübersicht'
    });
    // Rechteck-Hintergrund
    // pointer-events als inline style gesetzt → überschreibt #menu-btn .st6 { pointer-events:none } aus CSS
    var rect = svgEl('rect', {
      'class': 'str6',
      x: '1507.6', y: '32.2',
      width: '73.6', height: '56.8',
      rx: '5.5', ry: '5.5'
    });
    rect.style.pointerEvents = 'all';
    a.appendChild(rect);
    a.appendChild(makePath(D_MENU1, 'str0'));
    a.appendChild(makePath(D_MENU2, 'str0'));
    a.appendChild(makePath(D_MENU3, 'str0'));
    return a;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Icons in die Seite einfügen
  ═══════════════════════════════════════════════════════════════════ */
  function inject() {
    // Bevorzugt: Icons in die vorhandene room-overlay SVG einhängen
    // (gleiche ViewBox 0 0 1600 900 → Icons erscheinen automatisch richtig positioniert)
    var target = document.querySelector('svg.room-overlay');

    if (!target) {
      // Fallback: eigenes festes SVG-Element erzeugen
      target = svgEl('svg', {
        viewBox:             '0 0 1600 900',
        preserveAspectRatio: 'xMidYMid meet'
      });
      target.style.cssText = [
        'position:fixed', 'top:0', 'left:0',
        'width:100%', 'height:100%',
        'pointer-events:none', 'z-index:50'
      ].join(';');
      document.body.appendChild(target);
      // Klickbare Elemente brauchen pointer-events wieder
      target.addEventListener('click', function () {});
    }

    // Icons in Gruppen-Container
    var iconGroup = svgEl('g', { id: 'icon-bar' });
    iconGroup.appendChild(buildWcag(wcagUrl));
    if (hilfeUrl) {
      iconGroup.appendChild(buildHilfe(hilfeUrl));
    }
    iconGroup.appendChild(buildMenu(menuUrl));

    target.appendChild(iconGroup);

    // JS-Hover für Icon 1 (nur wenn aktiv) und Icon 2
    if (wcagUrl) {
      var wcagEl = target.querySelector('#wcag-btn');
      if (wcagEl) addHover(wcagEl);
    }
    var hilfeEl = target.querySelector('#hilfe-btn');
    if (hilfeEl) addHover(hilfeEl);

    // Wenn Fallback-SVG: pointer-events für <a>-Elemente aktivieren
    if (!document.querySelector('svg.room-overlay')) {
      target.querySelectorAll('a').forEach(function (a) {
        a.style.pointerEvents = 'all';
      });
    }
  }

  // Warten bis DOM fertig geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();

 // ── Icons keyboard-zugänglich machen ────────────────────────────────────
    // icons.js rendert die Buttons; wir warten bis sie im DOM sind.
    window.addEventListener('load', () => {
      const cfg = window.LEVEL_CONFIG || {};
      const iconMap = {
        'wcag-btn':  cfg.wcagUrl,
        'hilfe-btn': cfg.hilfeUrl,
        'menu-btn':  cfg.menuUrl,
      };

      Object.entries(iconMap).forEach(([id, url]) => {
        const el = document.getElementById(id);
        if (!el) return;

        // In Tab-Reihenfolge aufnehmen
        el.setAttribute('tabindex', '0');

        // Enter / Leertaste lösen Navigation aus
        // (click wird auf dieser Seite geblockt → keydown nötig)
        if (url) {
          el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.location.href = url;
            }
          });
        }
      });
    });