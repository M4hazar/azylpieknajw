/*!
 * Azyl Piękna · strona salonu
 * intro.js: animowane intro strony głównej, czyli lot ptaka z logo
 * Autor: Paweł Hejna, https://github.com/m4hazar
 */

/*
 * Ptak z logo (płaski, 2D, to samo złoto co w logo) pojawia się duży na środku ekranu, macha skrzydłami i zostawia
 * delikatny złoty ślad. Potem wznosi się na swoje miejsce w logo, okrąg się rysuje, pojawiają się litery JW, a po
 * lądowaniu zostaje oryginalne logo i treść strony. Lot trwa ok. 4 s i nie da się go pominąć. Przycisk
 * „Odtwórz lot ponownie” powtarza go.
 *
 * Tryby:
 *   - html.intro (z boot.js): lot startuje od razu, treść jest ukryta do lądowania,
 *   - bez .intro (powrót z innej podstrony albo zabezpieczenie z boot.js): treść widać od razu, lot tylko na żądanie,
 *   - bez animacji (ograniczony ruch): strona statyczna, bez przycisku powtórki.
 *
 * Wymaga animowanego logo <svg class="logo-anim"> w .mark (src/components/intro/Mark.astro).
 */
import { gsap } from 'gsap';
import * as FLAP from './flap.js';

export function initIntro() {
  const doc = document.documentElement;
  const mark = document.querySelector('.mark');
  const logoWrap = mark?.querySelector('.logo-wrap');
  const logo = mark?.querySelector('.logo');
  const svg = mark?.querySelector('.logo-anim');
  const replayButton = document.querySelector('.replay');

  if (!logo || !svg || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.classList.remove('intro');
    svg?.remove();
    return;
  }
  doc.classList.add('animated');

  const byId = (id) => svg.getElementById(id);
  const bird = byId('bird'),
    tail = byId('tail'),
    letters = byId('jw'),
    pen = byId('pen'),
    bgPaint = byId('bgp');
  FLAP.init(svg);

  const ANCHOR = [955, 322]; // środek ptaka w układzie logo
  const FEATHER_TIPS = {
    // końce piór (źródła złotego śladu), w układzie logo
    wu: [
      [1014, 25],
      [1046, 73],
      [1066, 130],
      [1074, 190],
    ],
    wl: [
      [1131, 235],
      [1110, 291],
      [1080, 338],
    ],
    tail: [
      [1074, 563],
      [1136, 563],
      [1103, 620],
    ],
  };

  /* --- matematyka ------------------------------------------------------------------------------------------------ */

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  function smoothstep(a, b, x) {
    x = clamp((x - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  }

  function bezier(a, b, c, d, u) {
    const v = 1 - u;
    return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  }

  /* macierze 2D [a b c d e f] jak w SVG */
  function mul(m, n) {
    return [
      m[0] * n[0] + m[2] * n[1],
      m[1] * n[0] + m[3] * n[1],
      m[0] * n[2] + m[2] * n[3],
      m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4],
      m[1] * n[4] + m[3] * n[5] + m[5],
    ];
  }

  function invert(m) {
    const det = m[0] * m[3] - m[1] * m[2];
    return [
      m[3] / det,
      -m[1] / det,
      -m[2] / det,
      m[0] / det,
      (m[2] * m[5] - m[3] * m[4]) / det,
      (m[1] * m[4] - m[0] * m[5]) / det,
    ];
  }

  const apply = (m, x, y) => ({ x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] });
  const toAttr = (m) => `matrix(${m.map((v) => +v.toFixed(5)).join(' ')})`;

  /* układ logo -> piksele ekranu */
  function screenMatrix() {
    const c = svg.getScreenCTM();
    return [c.a, c.b, c.c, c.d, c.e, c.f];
  }

  /* --- złoty ślad (canvas 2D) ------------------------------------------------------------------------------------ */

  const canvas = document.querySelector('.sparks');
  const ctx = canvas.getContext('2d');
  const particles = [];
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  }
  resizeCanvas();
  addEventListener('resize', resizeCanvas);

  /* Iskra to gotowy obrazek (miękka kropka w jednym z dwóch odcieni) rysowany z przezroczystością: wygląda tak samo
     jak gradient radialny, ale nie trzeba go tworzyć dla każdej iskry w każdej klatce. */
  const SPRITE_SIZE = 64;
  const sprites = ['255,238,196', '222,180,104'].map((rgb) => {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE_SIZE;
    const g = sprite.getContext('2d');
    const half = SPRITE_SIZE / 2;
    const gradient = g.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, `rgba(${rgb},1)`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gradient;
    g.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    return sprite;
  });

  function emit(p, o = {}) {
    const a = Math.random() * 6.283,
      s = Math.random() * (o.speed || 0.35);
    particles.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(a) * s * 60,
      vy: (Math.sin(a) * s + (o.up || 0.06)) * 60,
      age: 0,
      life: (o.life || 1.1) + Math.random(),
      r: (o.r || 0.5) + Math.random() * (o.rr || 1.1),
      tone: Math.random(),
    });
  }

  /* dt w sekundach: ruch iskier nie zależy od liczby klatek na sekundę */
  function drawSparks(dt) {
    const drag = Math.pow(0.985, dt * 60);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.age += dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy += 9 * dt;
      q.vx *= drag;
      q.vy *= drag;
      if (q.age > q.life) {
        particles.splice(i, 1);
        continue;
      }
      const f = q.age / q.life;
      const rad = q.r * 4;
      ctx.globalAlpha = (f < 0.15 ? f / 0.15 : 1 - (f - 0.15) / 0.85) * 0.9;
      ctx.drawImage(sprites[q.tone > 0.55 ? 0 : 1], q.x - rad, q.y - rad, rad * 2, rad * 2);
    }
    ctx.globalAlpha = 1;
  }

  /* --- przechył logo za kursorem (delikatna głębia po zakończeniu intro) ------------------------------------------ */

  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let markOnScreen = true;
  new IntersectionObserver(([entry]) => {
    markOnScreen = entry.isIntersecting;
    if (!markOnScreen) tilt.tx = tilt.ty = 0;
  }).observe(mark);
  addEventListener(
    'pointermove',
    (e) => {
      if (!markOnScreen || e.pointerType !== 'mouse') return;
      tilt.ty = (e.clientX / innerWidth - 0.5) * 14;
      tilt.tx = -(e.clientY / innerHeight - 0.5) * 10;
      wake();
    },
    { passive: true },
  );

  /* --- stan lotu ------------------------------------------------------------------------------------------------- */

  // appear: pojawienie się, go: przelot z centrum do logo (0..1), flap: siła machania, pen: rysowanie okręgu
  const state = { appear: 0, go: 0, flap: 1, pen: 0 };
  let timeline = null,
    active = false,
    revealed = false,
    rotSmooth = 0,
    trail = 0;

  /* Zegar skrzydeł: faza uderzenia liczona z czasu osi GSAP (zgodna z nią także przy przycięciach). Każde uderzenie
     jest trochę inne (siła i tempo), przy wznoszeniu ptak bije szybciej, a ostatnie uderzenia są tak rozplanowane,
     żeby skończyły się dokładnie w górnym położeniu skrzydeł, czyli w pozie z logo: ostatnie uderzenie jest głębsze
     i wolniejsze (hamowanie), skrzydła unoszą się powoli i pióra układają się już w miejscu. */
  const RATE = 2.2; // uderzenia na sekundę
  const T_CLIMB = 1.1; // koniec zawisu na środku ekranu, start wznoszenia do logo
  const T_LOCK = T_CLIMB + 0.65; // od tej chwili liczba uderzeń do lądowania jest ustalona
  const T_TOP = T_CLIMB + 1.55; // skrzydła w górze, w pozie z logo
  let phase = 0,
    lastT = 0,
    lock = null,
    seed = 0;

  function noise(k) {
    const x = Math.sin(k * 127.1 + seed * 311.7) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }

  /* płynny szum: inna wartość dla każdego uderzenia */
  function vary(p) {
    const k = Math.floor(p);
    let s = p - k;
    s = s * s * (3 - 2 * s);
    return noise(k) + (noise(k + 1) - noise(k)) * s;
  }

  function hermite(s, m0, m1) {
    const s2 = s * s,
      s3 = s2 * s;
    return (s3 - 2 * s2 + s) * m0 + (3 * s2 - 2 * s3) + (s3 - s2) * m1;
  }

  function wingClock(T, dT) {
    const rate = RATE * (1 + 0.045 * vary(phase + 17.3)) * (1 + 0.16 * smoothstep(T_CLIMB, T_CLIMB + 0.5, T));
    if (T < T_LOCK) {
      phase += dT * rate;
      return;
    }
    if (!lock) {
      // ile pełnych uderzeń zmieści się do lądowania
      const t0 = T - dT; // od poprzedniej klatki, żeby faza nie stanęła ani razu
      const span = Math.max(0.2, T_TOP - t0);
      const N = Math.max(Math.ceil(phase + 0.4), Math.round(phase + (rate * span) / 1.15));
      lock = { t: t0, p: phase, N, span, m0: (rate * span) / (N - phase) };
    }
    const u = Math.min(1, (T - lock.t) / lock.span);
    phase = lock.p + (lock.N - lock.p) * hermite(u, Math.min(1.8, lock.m0), 0.55);
  }

  /* siła uderzenia: lekkie różnice między uderzeniami, głębsze uderzenie hamujące przed lądowaniem */
  function wingAmp() {
    let a = 1 + 0.06 * vary(phase);
    if (lock && phase > lock.N - 1) a += 0.1 * Math.sin(Math.PI * (phase - lock.N + 1));
    return a;
  }

  /* Obrysy piór są malowane tłem strony (--backdrop z tokens.css, przypięty do okna): gradient #bgp przeliczony
     z ekranu do układu ptaka. Na tle obrys znika, a na złocie wygląda jak przerwa. */
  function paintOutlines(M) {
    const W = doc.clientWidth || innerWidth,
      H = doc.clientHeight || innerHeight;
    bgPaint.setAttribute('gradientTransform', toAttr(mul(invert(M), [1.2 * W, 0, 0, 0.8 * H, 0.5 * W, 0.28 * H])));
  }

  function birdPose(t, dT) {
    const W = innerWidth,
      H = innerHeight,
      C = screenMatrix();
    const home = apply(C, ANCHOR[0], ANCHOR[1]),
      k = C[0]; // miejsce ptaka w logo na ekranie i skala logo
    // duży na środku: wysokość ok. 56% ekranu (na telefonie ograniczona szerokością, z zapasem na skrzydło w dole)
    const big = Math.min((H * 0.56) / (608 * k), (W * (W < 700 ? 0.66 : 0.5)) / (372 * k), 6);
    const hover = 1 - state.go;
    // zawis na środku ekranu (punkt ANCHOR jest prawie w środku obrysu ptaka)
    const cx = W * 0.49 + hover * W * 0.02 * Math.sin(t * 1.2);
    const cy = H * 0.47 + hover * H * 0.028 * Math.sin(t * 2.4) + (1 - state.appear) * H * 0.03;
    // Tor do logo: strome wznoszenie, małe przesunięcie w bok rozłożone na całe wznoszenie (ptak patrzy w lewo,
    // więc nie może wyraźnie lecieć w prawo, czyli do tyłu), a na końcu prawie pionowo w górę i odrobinę do przodu.
    const u = state.go;
    const p1x = cx + (home.x - cx) * 0.45,
      p1y = cy - H * 0.16,
      p2x = home.x + W * 0.01,
      p2y = home.y + H * 0.09;
    const X = bezier(cx, p1x, p2x, home.x, u),
      Y = bezier(cy, p1y, p2y, home.y, u);
    const u2 = Math.min(1, u + 0.02);
    const dx = bezier(cx, p1x, p2x, home.x, u2) - X,
      dy = bezier(cy, p1y, p2y, home.y, u2) - Y;
    const s = (1 + (big - 1) * Math.pow(1 - u, 1.6)) * (0.9 + 0.1 * state.appear);

    // przechył za kierunkiem lotu (dziób w lewo), w zawisie lekkie kołysanie; wygładzony niezależnie od liczby klatek
    let rot = 0;
    if (u > 0 && u < 1 && dx * dx + dy * dy > 1e-6) {
      let th = (Math.atan2(dy, dx) * 180) / Math.PI - 180;
      th = ((th + 540) % 360) - 180;
      rot = clamp(th, -24, 24) * Math.sin(Math.PI * u);
    }
    rot += hover * (3 * Math.sin(t * 1.2 + 1) - 2 * Math.cos(t * 1.2));
    rotSmooth += (rot - rotSmooth) * (1 - Math.pow(0.8, dT * 60));

    const P = apply(invert(C), X, Y);
    const F = FLAP.pose(phase, state.flap * wingAmp());
    // hamowanie przed lądowaniem: ptak unosi dziób i ustawia się do skrzydeł
    const flare = 5 * Math.sin(Math.PI * smoothstep(T_TOP - 0.7, T_TOP + 0.25, t));
    const r = ((rotSmooth + F.pitch + flare) * Math.PI) / 180;
    const cs = Math.cos(r) * s,
      sn = Math.sin(r) * s;
    const ay = ANCHOR[1] - F.bob;
    const B = [cs, sn, -sn, cs, P.x - (cs * ANCHOR[0] - sn * ay), P.y - (sn * ANCHOR[0] + cs * ay)];
    return { B, F, C };
  }

  /* --- pętla klatek: działa tylko wtedy, gdy coś się rusza -------------------------------------------------------- */

  let running = false,
    lastFrame = 0;

  function wake() {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    requestAnimationFrame(frame);
  }

  function frame(now) {
    const dt = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;

    if (active) {
      const T = timeline.time(),
        dT = Math.max(0, T - lastT);
      lastT = T;
      wingClock(T, dT);
      const pose = birdPose(T, dT);
      const M = mul(pose.C, pose.B);
      bird.setAttribute('transform', toAttr(pose.B));
      if (state.flap > 0) paintOutlines(M);
      FLAP.set(pose.F);
      tail.setAttribute('transform', toAttr(pose.F.tail));
      pen.setAttribute('stroke-dasharray', `${state.pen.toFixed(4)} 2`);

      // ślad: pył z końców piór, słabnie przy lądowaniu
      trail += dt * 80 * state.flap * state.appear * (1 - state.go);
      const n = trail | 0;
      trail -= n;
      for (let j = 0; j < n; j++) {
        const id = Math.random() < 0.5 ? 'wu' : Math.random() < 0.65 ? 'wl' : 'tail';
        const tips = FEATHER_TIPS[id],
          tip = tips[(Math.random() * tips.length) | 0];
        const x = tip[0] + (Math.random() - 0.5) * 16,
          y = tip[1] + (Math.random() - 0.5) * 16;
        const q = id === 'tail' ? apply(pose.F.tail, x, y) : pose.F.pt(id, x, y);
        emit(apply(M, q.x, q.y));
      }
      tilt.tx = tilt.ty = 0;
    }

    if (particles.length) drawSparks(dt);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ease = 1 - Math.pow(0.94, dt * 60); // wygładzanie niezależne od liczby klatek na sekundę
    tilt.x += (tilt.tx - tilt.x) * ease;
    tilt.y += (tilt.ty - tilt.y) * ease;
    const tilted = Math.abs(tilt.x) + Math.abs(tilt.y) > 0.01;
    logoWrap.style.transform = tilted ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)` : '';

    const settled = Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) < 0.01;
    if (active || particles.length || !settled) requestAnimationFrame(frame);
    else running = false;
  }

  /* --- przebieg intro -------------------------------------------------------------------------------------------- */

  function reveal() {
    gsap.fromTo(
      '.reveal',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.07,
        overwrite: true,
        onStart: () => doc.classList.remove('intro'),
      },
    );
    gsap.fromTo('.divider', { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay: 0.15 });
    revealed = true;
  }

  /* błysk przesuwający się po złocie logo */
  function shine() {
    mark.classList.remove('shine');
    void mark.offsetWidth;
    mark.classList.add('shine');
  }

  /* iskry wokół ptaka, gdy siada */
  function landed() {
    const r = logo.getBoundingClientRect();
    for (let i = 0; i < 26; i++) {
      emit(
        { x: r.left + r.width * (0.66 + Math.random() * 0.28), y: r.top + r.height * (0.04 + Math.random() * 0.42) },
        { speed: 0.5, up: -0.05, life: 0.8, r: 0.6, rr: 1.3 },
      );
    }
  }

  function finish() {
    active = false;
    doc.classList.remove('lock');
    gsap.set(logo, { opacity: 1 });
    gsap.set(svg, { opacity: 0 });
    if (!revealed) reveal();
  }

  /* oś czasu: pojawienie się i lot na środku -> przelot do logo -> okrąg i litery -> oryginalne logo -> treść */
  function play(first) {
    active = true;
    revealed = false;
    doc.classList.add('intro', 'lock');
    gsap.killTweensOf([logo, svg, state, letters, bird]);
    gsap.set(logo, { opacity: 0 });
    gsap.set(svg, { opacity: 1 });
    gsap.set([letters, bird], { opacity: 0 });
    pen.setAttribute('stroke-dasharray', '0 2');
    mark.classList.remove('shine');
    if (!first) {
      scrollTo(0, 0);
      gsap.to('.reveal', { opacity: 0, duration: 0.4, overwrite: true });
    }
    Object.assign(state, { appear: 0, go: 0, flap: 1, pen: 0 });
    rotSmooth = 0;
    phase = 0;
    lastT = 0;
    lock = null;
    seed = Math.random() * 10;

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(bird, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0)
      .to(state, { appear: 1, duration: 1.2, ease: 'power3.out' }, 0)
      .to(state, { go: 1, duration: 1.9, ease: 'power2.inOut' }, T_CLIMB)
      .to(state, { pen: 1, duration: 1.3, ease: 'power2.inOut' }, T_CLIMB + 0.9)
      .to(letters, { opacity: 1, duration: 0.9, ease: 'power2.out' }, T_CLIMB + 1.2)
      .to(state, { flap: 0, duration: 0.45, ease: 'sine.inOut' }, T_TOP) // skrzydła już w górze, pióra się układają
      .add(landed, T_TOP + 0.2)
      .add(reveal, T_CLIMB + 2)
      .to(logo, { opacity: 1, duration: 0.45, ease: 'power1.inOut' }, T_CLIMB + 2.2)
      .add(shine, T_CLIMB + 2.4)
      .set({}, {}, T_CLIMB + 2.7);
    timeline = tl;
    wake();
    return tl;
  }

  if (doc.classList.contains('intro')) {
    play(true);
  } else {
    setTimeout(shine, 450);
  }

  // powtórka lotu; w trakcie lotu przycisk nic nie robi
  replayButton?.addEventListener('click', () => {
    if (!active) play(false);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
}
