// ══════════════════════════════════════════════════════
//  script.js  —  Notebook interactive behaviours
// ══════════════════════════════════════════════════════

// ── 1. NOTEBOOK PAPER LINES ────────────────────────
// Draws horizontal blue lines + a red margin line
// on a full-page canvas to look like real notebook paper.

function drawPaperLines() {
  const canvas = document.getElementById('paper-lines');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.body.scrollHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lineSpacing = 32;
    const lineColor   = 'rgba(180, 200, 220, 0.45)';

    // horizontal rule lines
    ctx.strokeStyle = lineColor;
    ctx.lineWidth   = 1;
    for (let y = 80; y < canvas.height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // red margin line
    ctx.strokeStyle = 'rgba(220, 160, 165, 0.55)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(55, 0);
    ctx.lineTo(55, canvas.height);
    ctx.stroke();
  }

  resize();
  window.addEventListener('resize', resize);
}

drawPaperLines();


// ── 2. TYPEWRITER EFFECT ────────────────────────────
// Types out the heading character by character.

function typewriter(elementId, text, speed = 80, startDelay = 600) {
  const el = document.getElementById(elementId);
  let i = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
  }, startDelay);
}

typewriter('typewriter', 'MY NOTEBOOK', 100, 700);


// ── 3. SPEECH BUBBLE CYCLING ───────────────────────
// The stickman cycles through fun phrases.

const phrases = [
  'hey there! 👋',
  'let\'s learn!',
  'draw with me!',
  'code is fun!',
  'don\'t give up!',
  'you got this ✨'
];
let phraseIndex = 0;

function cycleBubble() {
  const el = document.getElementById('bubble-text');
  phraseIndex = (phraseIndex + 1) % phrases.length;

  // quick fade out → change → fade in
  el.style.transition = 'opacity 0.25s';
  el.style.opacity    = '0';
  setTimeout(() => {
    el.textContent = phrases[phraseIndex];
    el.style.opacity = '1';
  }, 260);
}

// Change every 2.5 seconds
setInterval(cycleBubble, 2500);


// ── 4. SCRIBBLE UNDERLINE ──────────────────────────
// Draws a wobbly hand-drawn underline under the heading.

function drawScribble() {
  const path = document.getElementById('scribble-path');
  const points = [];
  const steps  = 20;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 300;
    const y = 8 + (Math.random() * 8 - 4) + (i % 2 === 0 ? 3 : -3);
    points.push([x, y]);
  }

  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i][0] + points[i + 1][0]) / 2;
    const my = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q ${points[i][0]} ${points[i][1]}, ${mx} ${my}`;
  }

  path.setAttribute('d', d);

  // animate it drawing in
  const len = 400;
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  path.style.transition = 'stroke-dashoffset 1.2s ease 2.2s';
  setTimeout(() => { path.style.strokeDashoffset = '0'; }, 50);
}

drawScribble();


// ── 5. SCROLL OBSERVER ────────────────────────────
// Watches elements as they scroll into view and
// adds the "visible" class to trigger CSS animations.

function setupScrollObserver() {
  const targets = document.querySelectorAll(
    '.reveal-up, .card, .slide-words, .stat'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        setTimeout(() => {
          el.classList.add('visible');

          // trigger stat counter if it's a stat
          if (el.classList.contains('stat')) {
            animateCounter(el);
          }

          // draw the doodle arrow when slide-words are visible
          if (el.classList.contains('slide-words')) {
            const arrow = el.parentElement.querySelector('.draw-path');
            if (arrow) arrow.classList.add('visible');
          }
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  targets.forEach(el => observer.observe(el));
}

setupScrollObserver();


// ── 6. ANIMATED COUNTER ───────────────────────────
// Counts up from 0 to the data-target number,
// like an odometer ticking.

function animateCounter(statEl) {
  const numEl  = statEl.querySelector('.stat-num');
  const target = parseInt(statEl.dataset.target);
  const duration = 1400; // ms
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);
    numEl.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


// ── 7. CURSOR DOODLE TRAIL ────────────────────────
// Leaves a small pencil-mark trail behind the cursor.

function setupCursorTrail() {
  const canvas = document.getElementById('doodle-trail');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const trail = [];   // stores recent positions
  let mouse = { x: -999, y: -999 };

  window.addEventListener('mousemove', e => {
    mouse = { x: e.clientX, y: e.clientY };
    trail.push({ x: mouse.x, y: mouse.y, age: 0 });
    if (trail.length > 22) trail.shift();
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < trail.length; i++) {
      const t     = trail[i];
      const prev  = trail[i - 1];
      const alpha = (i / trail.length) * 0.55;
      const width = (i / trail.length) * 2.5;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = `rgba(26, 18, 9, ${alpha})`;
      ctx.lineWidth   = width;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // age & remove old points
    for (let i = trail.length - 1; i >= 0; i--) {
      trail[i].age++;
      if (trail[i].age > 30) trail.splice(i, 1);
    }

    requestAnimationFrame(render);
  }

  render();
}

setupCursorTrail();


// ── 8. DRAWING CANVAS ────────────────────────────
// A mini drawing board where the user can scribble
// with their mouse / finger.

function setupDrawingCanvas() {
  const canvas = document.getElementById('drawing-canvas');
  const ctx    = canvas.getContext('2d');

  // set canvas pixel size to match CSS size
  function syncSize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
    ctx.lineCap   = 'round';
    ctx.lineJoin  = 'round';
  }
  syncSize();
  window.addEventListener('resize', syncSize);

  let drawing  = false;
  let lineWidth = 3;
  ctx.strokeStyle = '#1a1209';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e) {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.lineWidth = lineWidth;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  }

  function stopDraw() { drawing = false; }

  // mouse events
  canvas.addEventListener('mousedown',  startDraw);
  canvas.addEventListener('mousemove',  draw);
  canvas.addEventListener('mouseup',    stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  // touch events (mobile)
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove',  draw,      { passive: false });
  canvas.addEventListener('touchend',   stopDraw);

  // control buttons
  document.getElementById('btn-clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById('btn-thick').addEventListener('click', function() {
    lineWidth = 7;
    this.classList.add('active-btn');
    document.getElementById('btn-thin').classList.remove('active-btn');
  });

  document.getElementById('btn-thin').addEventListener('click', function() {
    lineWidth = 1.5;
    this.classList.add('active-btn');
    document.getElementById('btn-thick').classList.remove('active-btn');
  });
}

setupDrawingCanvas();


// ── 9. CARD CLICK WIGGLE ──────────────────────────
// Cards do a quick wiggle when clicked — a small
// example of adding JS to CSS animations.

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.animation = 'wiggle 0.4s ease';
    card.addEventListener('animationend', () => {
      card.style.animation = '';
    }, { once: true });
  });
});

// inject the wiggle keyframes dynamically (good JS trick!)
const style = document.createElement('style');
style.textContent = `
  @keyframes wiggle {
    0%   { transform: rotate(0deg)   translateY(0); }
    20%  { transform: rotate(-4deg)  translateY(-4px); }
    40%  { transform: rotate(4deg)   translateY(-4px); }
    60%  { transform: rotate(-3deg)  translateY(-2px); }
    80%  { transform: rotate(2deg)   translateY(-2px); }
    100% { transform: rotate(0deg)   translateY(0); }
  }
`;
document.head.appendChild(style);setupCursorTrail