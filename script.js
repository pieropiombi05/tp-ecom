// ══════════════════════════════════════════════════════
//  script.js — Womboo Ecommerce
//  Handles: products, cart, scroll animations,
//           filter tabs, header, contact form
// ══════════════════════════════════════════════════════


// ── 1. PRODUCT DATA ────────────────────────────────
// ✏️ Edit names, prices, categories, colours here.
// To add a product image: set  image: 'images/your-photo.jpg'

const products = [
  {
    id: 1, name: 'Cloud Linen Shirt',
    category: 'tops', price: 89,
    badge: 'new', colors: ['#f5f0e8','#c8d4c0','#2b2318'],
    image: null, // ✏️ replace with: 'images/cloud-linen-shirt.jpg'
    description: 'Relaxed linen shirt in a soft cloud-weight weave.'
  },
  {
    id: 2, name: 'Soft Knit Tee',
    category: 'tops', price: 55,
    badge: null, colors: ['#faf6f0','#d9cbb8','#c49a6c'],
    image: null,
    description: 'A gentle knit tee for all-day softness.'
  },
  {
    id: 3, name: 'Wide Linen Trousers',
    category: 'bottoms', price: 110,
    badge: 'new', colors: ['#e8d5c4','#b5a28c'],
    image: null,
    description: 'Wide-leg trousers in breathable linen.'
  },
  {
    id: 4, name: 'Easy Cargo Pants',
    category: 'bottoms', price: 98,
    badge: null, colors: ['#2b2318','#c8d4c0','#d9cbb8'],
    image: null,
    description: 'Relaxed cargo with soft utility pockets.'
  },
  {
    id: 5, name: 'Boxy Overshirt',
    category: 'outerwear', price: 130,
    badge: null, colors: ['#f5f0e8','#2b2318'],
    image: null,
    description: 'A boxy overshirt in washed canvas.'
  },
  {
    id: 6, name: 'Soft Knit Cardigan',
    category: 'outerwear', price: 145,
    badge: 'new', colors: ['#faf6f0','#e8d5c4','#c8d4c0'],
    image: null,
    description: 'Chunky knit cardigan in a palette of soft neutrals.'
  },
  {
    id: 7, name: 'Organic Cotton Shorts',
    category: 'bottoms', price: 72,
    badge: null, colors: ['#b5a28c','#d9cbb8'],
    image: null,
    description: 'Lightweight organic cotton shorts with an easy drawstring.'
  },
  {
    id: 8, name: 'Ribbed Tank Top',
    category: 'tops', price: 42,
    badge: 'sale', originalPrice: 58, colors: ['#faf6f0','#2b2318','#c49a6c'],
    image: null,
    description: 'A fine-rib tank in washed organic cotton.'
  },
  {
    id: 9, name: 'Womboo Tote Bag',
    category: 'accessories', price: 38,
    badge: null, colors: ['#f5f0e8','#2b2318'],
    image: null,
    description: 'Heavy canvas tote with the Womboo eyes logo.'
  },
  {
    id: 10, name: 'Scrunchie Set',
    category: 'accessories', price: 22,
    badge: null, colors: ['#e8d5c4','#c8d4c0','#d9cbb8'],
    image: null,
    description: 'Set of three scrunchies in coordinating linen fabrics.'
  },
  {
    id: 11, name: 'Trench Coat',
    category: 'outerwear', price: 220,
    badge: 'new', colors: ['#d9cbb8','#2b2318'],
    image: null,
    description: 'A relaxed trench in water-resistant cotton blend.'
  },
  {
    id: 12, name: 'Linen Cap',
    category: 'accessories', price: 45,
    badge: null, colors: ['#f5f0e8','#b5a28c','#2b2318'],
    image: null,
    description: 'Washed linen cap with tonal Womboo embroidery.'
  }
];


// ── 2. CART STATE ──────────────────────────────────
// The cart is an array of { product, qty } objects.
// All cart functions live here so they're easy to find.

let cart = [];

function getCartItem(productId) {
  return cart.find(item => item.product.id === productId);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = getCartItem(productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }

  renderCart();
  openCart();
  bumpCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  renderCart();
}

function changeQty(productId, delta) {
  const item = getCartItem(productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}


// ── 3. RENDER CART ─────────────────────────────────
function renderCart() {
  const container  = document.getElementById('cart-items');
  const totalEl    = document.getElementById('cart-total-price');
  const countEl    = document.getElementById('cart-count');

  // Update count badge
  const count = getCartCount();
  countEl.textContent = count;

  // Update total
  totalEl.textContent = '$' + getCartTotal().toFixed(2);

  // Render items
  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your bag is empty 🌿</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.product.id}">
      <div class="cart-item-img">
        ${item.product.image
          ? `<img src="${item.product.image}" alt="${item.product.name}">`
          : `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" stroke="#b5a28c" stroke-width="1.5">
               <rect x="8" y="8" width="48" height="48" rx="4"/>
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
      <button class="cart-item-remove" onclick="removeFromCart(${item.product.id})" aria-label="Remove">✕</button>
    </div>
  `).join('');
}


// ── 4. OPEN / CLOSE CART ───────────────────────────
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

function bumpCartCount() {
  const el = document.getElementById('cart-count');
  el.classList.remove('bump');
  void el.offsetWidth; // force reflow
  el.classList.add('bump');
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);


// ── 5. RENDER PRODUCT GRID ─────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card" data-id="${p.id}" style="transition-delay:${(i % 4) * 80}ms">
      <div class="product-img-wrap">

        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
          : `<div class="product-img-placeholder">
               <svg width="40" height="40" viewBox="0 0 64 64" fill="none" stroke="#b5a28c" stroke-width="1.5">
                 <rect x="8" y="8" width="48" height="48" rx="4"/>
                 <circle cx="32" cy="28" r="10"/>
                 <path d="M16 56 Q32 42 48 56"/>
               </svg>
               <span>Add photo</span>
             </div>`
        }

        ${p.badge ? `<span class="product-tag-badge tag-${p.badge}">${p.badge}</span>` : ''}

        <button class="product-quick-add" onclick="addToCart(${p.id})">
          + Add to bag
        </button>
      </div>

      <div class="product-info">
        <div class="product-info-top">
          <span class="product-name">${p.name}</span>
          <span class="product-price">
            ${p.originalPrice ? `<span class="original">$${p.originalPrice}</span>` : ''}
            $${p.price}
          </span>
        </div>
        <div class="product-category">${p.category}</div>
        <div class="product-colors">
          ${p.colors.map(c =>
            `<span class="color-dot" style="background:${c}" title="${c}"></span>`
          ).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe cards for scroll animation
  observeCards();
}


// ── 6. FILTER TABS ─────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    // Fade grid out, swap, fade in
    const grid = document.getElementById('product-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';
    grid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => {
      renderProducts(filter);
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 250);
  });
});


// ── 7. SCROLL REVEAL ──────────────────────────────
// Uses IntersectionObserver to add .in-view to elements
// when they scroll into the viewport.

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('in-view'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

function observeAll() {
  document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
    revealObserver.observe(el);
  });
}

function observeCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    revealObserver.observe(card);
  });
}


// ── 8. HERO TEXT REVEAL ───────────────────────────
// Animates each line of the hero title on load.

function animateHeroLines() {
  document.querySelectorAll('.hero-title .reveal-line').forEach((line, i) => {
    const delay = parseInt(line.dataset.delay || 0);
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;
    // trigger after a tiny delay to allow transition to register
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    });
  });
}


// ── 9. STICKY HEADER ──────────────────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });


// ── 10. MOBILE HAMBURGER ──────────────────────────
document.getElementById('hamburger').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobile-menu').classList.remove('open');
  });
});


// ── 11. CONTACT FORM ──────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  // ✏️ Replace this with a real form submission (e.g. Formspree, EmailJS)
  const successMsg = document.getElementById('form-success');
  successMsg.classList.add('show');
  this.reset();
  setTimeout(() => successMsg.classList.remove('show'), 4000);
});


// ── 12. SMOOTH ANCHOR SCROLLING ───────────────────
// Accounts for the fixed header height when jumping to sections.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ── 13. PARALLAX BLOBS ────────────────────────────
// Gives the hero background blobs a gentle parallax on scroll.
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  const b3 = document.querySelector('.blob-3');
  if (b1) b1.style.transform = `translateY(${y * 0.15}px)`;
  if (b2) b2.style.transform = `translateY(${-y * 0.1}px)`;
  if (b3) b3.style.transform = `translateY(${y * 0.08}px)`;
}, { passive: true });


// ── INIT ──────────────────────────────────────────
renderProducts();   // build the product grid
renderCart();       // initialise cart badge at 0
animateHeroLines(); // kick off hero text animation
observeAll();       // start scroll observers