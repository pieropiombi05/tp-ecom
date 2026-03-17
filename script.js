// ══════════════════════════════════════════════════════
//  script.js — WOMBOO Streetwear Ecommerce
//  Black · Concrete Grey · Blood Red · 90s Archive
// ══════════════════════════════════════════════════════


// ── 1. PRODUCT DATA ────────────────────────────────
// ✏️ Edit names, prices, categories, colours here.
// Add product images: set  image: 'images/filename.jpg'

const products = [
  {
    id: 1,
    name: 'Archive Crewneck',
    category: 'tops',
    price: 98,
    badge: 'new',
    colors: ['#e8e4dc', '#0a0a0a', '#9b1c1c'],
    image: 'C:\Users\piero\OneDrive\Área de Trabalho\tp-ecom\images'
    description: '400gsm heavyweight crewneck. Oversized fit. Stone-washed.'
  },
  {
    id: 2,
    name: 'Washed Box Tee',
    category: 'tops',
    price: 55,
    badge: null,
    colors: ['#3d3d3d', '#e8e4dc'],
    image: 'C:\Users\piero\OneDrive\Área de Trabalho\tp-ecom\images'
    description: 'Box-cut tee in garment-washed 220gsm cotton.'
  },
  {
    id: 3,
    name: 'Utility Cargo Pant',
    category: 'bottoms',
    price: 130,
    badge: 'new',
    colors: ['#242424', '#6b6b6b', '#8a8a8a'],
    image: 'C:\Users\piero\OneDrive\Área de Trabalho\tp-ecom\images'
    description: 'Relaxed cargo in heavyweight ripstop. Six pockets.'
  },
  {
    id: 4,
    name: 'Womboo Track Pant',
    category: 'bottoms',
    price: 110,
    badge: null,
    colors: ['#0a0a0a', '#9b1c1c'],
    image: null,
    description: 'French terry trackpant. Womboo eyes embroidered at left hip.'
  },
  {
    id: 5,
    name: 'Field Jacket',
    category: 'outerwear',
    price: 220,
    badge: 'new',
    colors: ['#3d3d3d', '#242424'],
    image: null,
    description: 'Four-pocket field jacket in waxed cotton canvas.'
  },
  {
    id: 6,
    name: 'Oversized Coach',
    category: 'outerwear',
    price: 185,
    badge: null,
    colors: ['#0a0a0a', '#e8e4dc', '#9b1c1c'],
    image: null,
    description: 'Coach jacket in nylon ripstop. Dropped shoulders. Boxy.'
  },
  {
    id: 7,
    name: 'Archive Short',
    category: 'bottoms',
    price: 75,
    badge: 'sale',
    originalPrice: 95,
    colors: ['#8a8a8a', '#0a0a0a'],
    image: null,
    description: 'Heavyweight 8" inseam short. Garment-dyed concrete grey.'
  },
  {
    id: 8,
    name: 'Logo Longsleeve',
    category: 'tops',
    price: 68,
    badge: null,
    colors: ['#242424', '#e8e4dc'],
    image: null,
    description: 'Heavyweight longsleeve. Womboo eyes screenprint chest-hit.'
  },
  {
    id: 9,
    name: 'Womboo Cap',
    category: 'accessories',
    price: 45,
    badge: null,
    colors: ['#0a0a0a', '#e8e4dc'],
    image: null,
    description: 'Six-panel structured cap. Womboo eyes embroidered at front.'
  },
  {
    id: 10,
    name: 'Archive Tote',
    category: 'accessories',
    price: 38,
    badge: null,
    colors: ['#e8e4dc', '#0a0a0a'],
    image: null,
    description: '16oz canvas tote. Drop handle. Womboo logo screenprint.'
  },
  {
    id: 11,
    name: 'Quilted Work Jacket',
    category: 'outerwear',
    price: 250,
    badge: 'new',
    colors: ['#1a1a1a', '#3d3d3d'],
    image: null,
    description: 'Quilted work jacket in washed poly-fill. Barn collar.'
  },
  {
    id: 12,
    name: 'Chain Wallet',
    category: 'accessories',
    price: 55,
    badge: null,
    colors: ['#8a8a8a', '#0a0a0a'],
    image: null,
    description: 'Full-grain leather bifold with stainless chain. Womboo stamp.'
  }
];


// ── 2. CART STATE ──────────────────────────────────
let cart = [];

function getCartItem(id) {
  return cart.find(item => item.product.id === id);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = getCartItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }

  renderCart();
  openCart();
  bumpCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.product.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else renderCart();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}


// ── 3. RENDER CART ─────────────────────────────────
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl   = document.getElementById('cart-total-price');
  const countEl   = document.getElementById('cart-count');

  countEl.textContent = cartCount();
  totalEl.textContent = '$' + cartTotal().toFixed(2);

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.product.id}">
      <div class="cart-item-img">
        ${item.product.image
          ? `<img src="${item.product.image}" alt="${item.product.name}">`
          : `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="#3d3d3d" stroke-width="1.5">
               <rect x="8" y="8" width="48" height="48" rx="2"/>
               <circle cx="32" cy="28" r="10"/>
               <path d="M16 56 Q32 42 48 56"/>
             </svg>`
        }
      </div>
      <div class="cart-item-info">
        <h4>${item.product.name}</h4>
        <span class="cart-item-price">$${item.product.price.toFixed(2)}</span>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.product.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.product.id}, +1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.product.id})">✕</button>
    </div>
  `).join('');
}


// ── 4. CART OPEN / CLOSE ───────────────────────────
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function bumpCount() {
  const el = document.getElementById('cart-count');
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);


// ── 5. RENDER PRODUCT GRID ─────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  const list = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  grid.innerHTML = list.map((p, i) => `
    <div class="product-card" data-id="${p.id}" style="transition-delay:${(i % 4) * 60}ms">
      <div class="product-img-wrap">

        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
          : `<div class="product-img-placeholder">
               <svg width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="#3d3d3d" stroke-width="1.5">
                 <rect x="8" y="8" width="48" height="48" rx="2"/>
                 <circle cx="32" cy="28" r="10"/>
                 <path d="M16 56 Q32 42 48 56"/>
               </svg>
               <span>Add photo</span>
             </div>`
        }

        ${p.badge ? `<span class="product-badge tag-${p.badge}">${p.badge.toUpperCase()}</span>` : ''}

        <button class="product-quick-add" onclick="addToCart(${p.id})">
          + ADD TO BAG
        </button>
      </div>

      <div class="product-info">
        <div class="product-info-row">
          <span class="product-name">${p.name}</span>
          <span class="product-price">
            ${p.originalPrice ? `<span class="original">$${p.originalPrice}</span>` : ''}
            $${p.price}
          </span>
        </div>
        <div class="product-cat">${p.category.toUpperCase()}</div>
        <div class="product-colors">
          ${p.colors.map(c =>
            `<span class="color-dot" style="background:${c}" title="${c}"></span>`
          ).join('')}
        </div>
      </div>
    </div>
  `).join('');

  observeCards();
}


// ── 6. FILTER TABS ─────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById('product-grid');
    grid.style.transition = 'opacity 0.2s, transform 0.2s';
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(8px)';

    setTimeout(() => {
      renderProducts(btn.dataset.filter);
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 200);
  });
});


// ── 7. INTERSECTION OBSERVER (scroll reveal) ───────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in-view'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

function observeAll() {
  document.querySelectorAll('.reveal-up, .reveal-clip').forEach(el => observer.observe(el));
}

function observeCards() {
  document.querySelectorAll('.product-card').forEach(el => observer.observe(el));
}


// ── 8. HERO TITLE ANIMATION ────────────────────────
// Staggered clip-path reveal on each title line at load.
function animateHero() {
  document.querySelectorAll('.hero-title .title-line').forEach(line => {
    const delay = parseInt(line.dataset.delay || 0);
    line.style.opacity = '0';
    line.style.clipPath = 'inset(0 0 100% 0)';
    line.style.transition = `opacity 0.6s ease ${delay}ms, clip-path 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      line.style.opacity = '1';
      line.style.clipPath = 'inset(0 0 0% 0)';
    }));
  });
}


// ── 9. STICKY HEADER ──────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ── 10. MOBILE HAMBURGER ──────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ── 11. CONTACT FORM ──────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // ✏️ Swap in Formspree / EmailJS here when ready
  const msg = document.getElementById('form-success');
  msg.classList.add('show');
  this.reset();
  setTimeout(() => msg.classList.remove('show'), 4000);
});


// ── 12. SMOOTH SCROLL (offset for fixed nav) ──────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});


// ── 13. HERO PARALLAX ─────────────────────────────
// The giant ghost type in the hero background moves
// slightly slower than the page — classic parallax.
window.addEventListener('scroll', () => {
  const bgType = document.querySelector('.hero-bg-type');
  if (bgType) bgType.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.2}px))`;
}, { passive: true });


// ── INIT ──────────────────────────────────────────
renderProducts();
renderCart();
animateHero();
observeAll();


// ── 14. LOGO EYE MOUSE TRACKING ───────────────────
// Pupils follow the mouse cursor.
// Calculates angle from each eye center to the mouse,
// moves the pupil in that direction, clamped inside the eyeball.

function setupEyeTracking() {
  const logo = document.querySelector('.logo-svg');
  if (!logo) return;

  const eyes = logo.querySelectorAll('.eye');

  window.addEventListener('mousemove', (e) => {
    eyes.forEach(eye => {
      const ellipse = eye.querySelector('ellipse');
      const circles = eye.querySelectorAll('circle');
      const pupil   = circles[0];
      const shine   = circles[1];
      if (!ellipse || !pupil) return;

      const rect = ellipse.getBoundingClientRect();
      const eyeX = rect.left + rect.width  / 2;
      const eyeY = rect.top  + rect.height / 2;

      const dx    = e.clientX - eyeX;
      const dy    = e.clientY - eyeY;
      const angle = Math.atan2(dy, dx);

      // Max travel in SVG px — keep pupil inside ellipse
      const maxTravel = 2.8;
      const dist      = Math.min(Math.hypot(dx, dy) / (rect.width * 1.2), 1) * maxTravel;

      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      pupil.style.transform = `translate(${tx}px, ${ty}px)`;
      if (shine) shine.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    if (!logo) return;
    logo.querySelectorAll('.eye circle').forEach(c => {
      c.style.transform = 'translate(0px, 0px)';
    });
  });
}

setupEyeTracking();