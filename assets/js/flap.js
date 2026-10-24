/*!
 * Azyl Piękna · strona w budowie
 * flap.js: machanie skrzydłami ptaka z logo
 * Autor: Paweł Hejna, https://github.com/m4hazar
 */

/*
 * Ptak jest widziany z boku, więc skrzydło nie macha jak wycieraczka, tylko obraca się wokół osi ciała:
 * z góry (poza z logo) przechodzi przez skrót (zwrócone do widza) w dół i wraca. Każdy punkt skrzydła jest liczony
 * osobno:
 *   - końce piór spóźniają się za nasadą (sprężyste pióra wyginają się przy uderzeniu),
 *   - przy podnoszeniu skrzydło się składa, odchyla do tyłu i zamyka wachlarz piór, na górze znowu się rozkłada,
 *   - tułów podskakuje przy uderzeniu w dół, a ogon odpowiada z opóźnieniem.
 *
 * API (window.FLAP):
 *   init(svg)    przygotowuje pióra z animowanego logo (ścieżki .feather w <g id="wu"> i <g id="wl">),
 *   pose(ph, f)  poza dla fazy ph (0 = skrzydła w górze, rośnie w czasie) i siły f (0 = spoczynek, jak w logo),
 *   set(pose)    ustawia kształt piór dla pozy z pose().
 */
window.FLAP = (() => {
  'use strict';

  const DOWNSTROKE = 0.42;              // część cyklu na uderzenie w dół (szybsze niż w górę)

  /*
   * Parametry skrzydeł (wu: przednie, wl: tylne), współrzędne w układzie logo:
   *   p     nasada skrzydła          ax    kierunek osi obrotu (stopnie)   len   długość skrzydła
   *   phi   obrót wokół osi (rad)    lag   spóźnienie końców piór          fold  skrócenie przy podnoszeniu
   *   bend  odchylenie końca do tyłu fan   rozchylenie wachlarza piór      fwd   wysunięcie do przodu przy uderzeniu
   *   depth strona ciała (1: bliżej widza, -1: dalej)                      lead  wyprzedzenie fazy
   */
  const WINGS = {
    wu: { p: [922, 312], ax: 8, len: 300, phi: 2.25, lag: 0.06, fold: 0.3, bend: 0.5, fan: 0.2, fwd: 0.12, depth: 1, lead: 0 },
    wl: { p: [926, 334], ax: 22, len: 230, phi: 1.9, lag: 0.05, fold: 0.22, bend: 0.35, fan: 0.14, fwd: 0.08, depth: -1, lead: 0.035 }
  };
  const TAIL_PIVOT = [952, 398];

  /* położenie skrzydła w cyklu: 0 = w górze, 1 = na dole */
  function down(ph) {
    ph -= Math.floor(ph);
    return ph < DOWNSTROKE
      ? 0.5 - 0.5 * Math.cos(Math.PI * ph / DOWNSTROKE)
      : 0.5 + 0.5 * Math.cos(Math.PI * (ph - DOWNSTROKE) / (1 - DOWNSTROKE));
  }

  /* złożenie skrzydła przy podnoszeniu */
  function folded(ph) {
    ph -= Math.floor(ph);
    return ph < DOWNSTROKE ? 0 : Math.pow(Math.sin(Math.PI * (ph - DOWNSTROKE) / (1 - DOWNSTROKE)), 1.3);
  }

  function smoothstep(a, b, x) {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  }

  /* ścieżka z bezwzględnymi poleceniami M, L, C, Z -> polecenia i płaska lista współrzędnych */
  function parsePath(d) {
    const cmds = [], xy = [];
    for (const t of d.match(/[MLCZ]|-?\d*\.?\d+/g)) {
      if (t === 'M' || t === 'L' || t === 'C' || t === 'Z') cmds.push(t);
      else xy.push(+t);
    }
    return { cmds, xy };
  }

  function init(svg) {
    for (const id in WINGS) {
      const w = WINGS[id];
      const group = svg.getElementById(id);
      const feathers = group.querySelectorAll('.feather');
      const a = w.ax * Math.PI / 180;
      w.AX = [Math.cos(a), Math.sin(a)];                // oś obrotu (w stronę ogona)
      w.N = [w.AX[1], -w.AX[0]];                         // kierunek grzbietu
      w.parts = [];

      let sx = 0, sy = 0, n = 0;
      feathers.forEach((el) => {
        const d = el.getAttribute('d');
        const base = parsePath(d);
        const joint = el.getAttribute('data-joint');
        if (joint) {
          // pióro obracane w stawie (nasada schowana pod tułowiem); punkt odniesienia: środek pióra
          base.joint = joint.split(' ').map(Number);
          let gx = 0, gy = 0, gn = 0;
          for (let j = 0; j < base.xy.length; j += 2) {
            if (Math.hypot(base.xy[j] - base.joint[0], base.xy[j + 1] - base.joint[1]) > 25) {
              gx += base.xy[j]; gy += base.xy[j + 1]; gn++;
            }
          }
          base.ref = [gx / gn, gy / gn, Math.hypot(gx / gn - base.joint[0], gy / gn - base.joint[1])];
        }
        w.parts.push({ el, rest: d, base, stroke: +el.getAttribute('data-stroke') });
        for (let j = 0; j < base.xy.length; j += 2) { sx += base.xy[j]; sy += base.xy[j + 1]; n++; }
      });

      // średni kierunek skrzydła (do wachlarza) i strona, w którą składa się jego koniec
      const mx = sx / n - w.p[0], my = sy / n - w.p[1], ml = Math.hypot(mx, my);
      w.m = [mx / ml, my / ml];
      w.back = (w.m[0] * w.AX[1] - w.m[1] * w.AX[0]) > 0 ? 1 : -1;
    }
  }

  /* położenie punktu (x, y) skrzydła w fazie ph przy sile f */
  function warp(w, x, y, ph, f) {
    const rx = x - w.p[0], ry = y - w.p[1];
    const rho = Math.min(1.3, Math.hypot(rx, ry) / w.len);
    const lp = ph - w.lag * rho + w.lead;
    const dn = down(lp), fo = folded(lp);

    // wachlarz: pióra rozchodzą się na górze, zbliżają przy podnoszeniu
    const spread = f * (w.fan * (0.3 - dn) - w.fan * 0.9 * fo);
    const beta = Math.atan2(w.m[0] * ry - w.m[1] * rx, w.m[0] * rx + w.m[1] * ry);

    // złożenie: koniec skrzydła krótszy i odchylony do tyłu
    const wr = smoothstep(0.25, 1, rho);
    const rot = beta * spread + w.back * f * w.bend * fo * wr;
    const sc = 1 - f * w.fold * fo * wr;
    const cs = Math.cos(rot) * sc, sn = Math.sin(rot) * sc;
    const qx = cs * rx - sn * ry, qy = sn * rx + cs * ry;

    // obrót wokół osi ciała (rzut z boku): skrót, potem w dół; przy uderzeniu lekko do przodu
    let u = qx * w.AX[0] + qy * w.AX[1];
    let v = qx * w.N[0] + qy * w.N[1];
    const phi = f * w.phi * dn, sv = Math.sin(phi);
    const z = v * sv * w.depth;
    u -= f * w.fwd * sv * rho * w.len;
    v *= Math.cos(phi);
    const persp = 1 + z * 0.0007;
    u *= persp;
    v *= persp;
    return [w.p[0] + u * w.AX[0] + v * w.N[0], w.p[1] + u * w.AX[1] + v * w.N[1]];
  }

  /* Długie pióro z grzbietu: nasada zostaje przy zaokrąglonym końcu grzbietu, a dalej pióro wygina się w dół tak,
     jak przesuwa się jego środek przy obrocie całego skrzydła, i skraca się razem z nim; koniec lekko się spóźnia. */
  function turn(w, b, x, y, ph, f) {
    const [cx, cy] = b.joint, ref = b.ref;
    const rx = x - cx, ry = y - cy, r = Math.hypot(rx, ry);
    const q = warp(w, ref[0], ref[1], ph - w.lag * (r - ref[2]) / w.len, f);
    const qx = q[0] - cx, qy = q[1] - cy, ql = Math.hypot(qx, qy);
    const th = Math.atan2(qy, qx) - Math.atan2(ref[1] - cy, ref[0] - cx);
    const sc = r > 12 ? (12 + (r - 12) * (ql - 12) / (ref[2] - 12)) / r : 1;   // nasada (12 jednostek) się nie skraca
    const cs = Math.cos(th) * sc, sn = Math.sin(th) * sc;
    return [cx + cs * rx - sn * ry, cy + sn * rx + cs * ry];
  }

  /* współrzędna z dokładnością do 0,1 jednostki logo (szybciej niż toFixed, a kształt ten sam) */
  const round = (v) => Math.round(v * 10) / 10;

  function shape(w, b, ph, f) {
    const xy = b.xy;
    let out = '', j = 0;
    for (const c of b.cmds) {
      const n = c === 'C' ? 3 : c === 'Z' ? 0 : 1;
      out += c;
      for (let q = 0; q < n; q++, j += 2) {
        const p = b.joint ? turn(w, b, xy[j], xy[j + 1], ph, f) : warp(w, xy[j], xy[j + 1], ph, f);
        out += (q ? ' ' : '') + round(p[0]) + ' ' + round(p[1]);
      }
    }
    return out;
  }

  function pose(ph, f) {
    const db = down(ph - 0.07) - 0.5, dt = down(ph - 0.2) - 0.5;
    const tr = f * 0.07 * dt, cs = Math.cos(tr), sn = Math.sin(tr);
    const [tx, ty] = TAIL_PIVOT;
    return {
      ph, f,
      tail: [cs, sn, -sn, cs, tx - (cs * tx - sn * ty), ty - (sn * tx + cs * ty)],
      bob: -f * 11 * db,                      // tułów idzie w górę, gdy skrzydła biją w dół
      pitch: -f * 2.2 * db,                   // i lekko podnosi dziób (stopnie)
      pt(id, x, y) {                          // punkt skrzydła po wygięciu (do złotego śladu)
        const q = warp(WINGS[id], x, y, ph, f);
        return { x: q[0], y: q[1] };
      }
    };
  }

  function set(P) {
    for (const id in WINGS) {
      const w = WINGS[id];
      // Obrys pióra (w kolorze tła, patrz #bgp w logo-anim.svg) oddziela skrzydło od tułowia i od innych piór.
      // Cienieje do zera, gdy skrzydło jest zwrócone krawędzią do widza (zmiana grubości, nie przezroczystości).
      const edgeOn = Math.abs(Math.cos(P.f * w.phi * down(P.ph - w.lag * 0.6 + w.lead)));
      const weight = Math.min(1, P.f * 4) * smoothstep(0.06, 0.4, edgeOn);
      for (const part of w.parts) {
        const d = P.f > 1e-4 ? shape(w, part.base, P.ph, P.f) : part.rest;
        const sw = (part.stroke * weight).toFixed(2);
        if (sw !== part.lastStroke) {
          part.el.setAttribute('stroke-width', sw);
          part.lastStroke = sw;
        }
        if (d !== part.lastD) {
          part.el.setAttribute('d', d);
          part.lastD = d;
        }
      }
    }
  }

  return { init, pose, set };
})();
