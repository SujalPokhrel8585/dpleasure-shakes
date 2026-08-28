// =========================================================
// D' PLEASURE — shared site behavior
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Dish rack: arrow buttons + click-and-drag scroll ---------- */
  const track = document.getElementById('dishTrack');
  const prevBtn = document.getElementById('dishPrev');
  const nextBtn = document.getElementById('dishNext');
  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => Math.min(320, track.clientWidth * 0.8);
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      dragged = false;
      track.classList.add('is-dragging');
      startX = e.pageX;
      startScroll = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const delta = e.pageX - startX;
      if (Math.abs(delta) > 4) dragged = true;
      track.scrollLeft = startScroll - delta;
    });
    // Prevent the "+" add-to-cart click from firing right after a drag
    track.addEventListener('click', (e) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Cart: WhatsApp checkout (no backend needed) ---------- */
  const CATALOG = {
    'oreo-eclipse': { name: 'Oreo Eclipse', price: 380 },
    'strawberry-serenade': { name: 'Strawberry Serenade', price: 360 },
    'vanilla-delight': { name: 'Vanilla Delight', price: 320 },
    'lemon-kissed-watermelon': { name: 'Lemon Kissed Watermelon', price: 300 },
    'ruby-lemonade': { name: 'Ruby Lemonade', price: 320 },
    'blue-island-twist': { name: 'Blue Island Twist', price: 340 },
    'tropical-mint-twist': { name: 'Tropical Mint Twist', price: 320 }
  };
  const CART_KEY = 'dp_cart_v1';
  const WHATSAPP_NUMBER = '9779815059360';
  const cartBadge = document.querySelector('.cart-badge');
  const fmt = (n) => 'Rs. ' + n.toLocaleString('en-IN');
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  };
  const cartCount = (cart) => cart.reduce((a, i) => a + i.qty, 0);

  function renderCart() {
    const drawer = document.getElementById('cartDrawer');
    const cart = readCart();
    const count = cartCount(cart);
    const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count ? 'grid' : 'none';
    }
    if (!drawer) return;
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const waBtn = document.getElementById('cartWhatsapp');
    if (!cart.length) {
      itemsEl.innerHTML = '<div class="cart-empty"><p>Your tray is empty.</p><p class="cart-empty-sub">The blender is waiting, and the menu has seven ways to fix that.</p></div>';
      totalEl.textContent = fmt(0);
      waBtn.setAttribute('aria-disabled', 'true');
      waBtn.setAttribute('href', '#');
      return;
    }
    waBtn.removeAttribute('aria-disabled');
    const lines = cart.map(i => i.qty + 'x ' + i.name + ' (' + fmt(i.qty * i.price) + ')');
    const totalMsg = 'Total: ' + fmt(total);
    const msg = "Hi D' Pleasure! I would like to order:\n" + lines.join('\n') +
      '\n\n' + totalMsg + '\n\nName: \nDelivery address: ';
    waBtn.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
    itemsEl.innerHTML = cart.map(i => (
      '<div class="cart-item" data-id="' + i.id + '">' +
        '<div><h4>' + i.name + '</h4><span class="ci-price">' + fmt(i.price) + ' each</span></div>' +
        '<span class="ci-line">' + fmt(i.qty * i.price) + '</span>' +
        '<div class="qty">' +
          '<button data-act="minus" aria-label="Remove one ' + i.name + '">&#8722;</button>' +
          '<span>' + i.qty + '</span>' +
          '<button data-act="plus" aria-label="Add one ' + i.name + '">+</button>' +
        '</div>' +
        '<button class="ci-remove" data-act="remove">Remove</button>' +
      '</div>'
    )).join('');
    totalEl.textContent = fmt(total);
  }

  const writeCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  };

  const drawer = document.getElementById('cartDrawer');
  const openCart = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.getElementById('cartOverlay').classList.add('is-open');
    document.body.classList.add('cart-open');
    document.getElementById('cartClose').focus();
  };
  const closeCart = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.getElementById('cartOverlay').classList.remove('is-open');
    document.body.classList.remove('cart-open');
  };

  if (drawer) {
    document.querySelector('.cart-close').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
    document.getElementById('cartItems').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const id = btn.closest('.cart-item').getAttribute('data-id');
      const act = btn.getAttribute('data-act');
      const cart = readCart();
      if (act === 'plus') {
        writeCart(cart.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
      } else if (act === 'minus') {
        writeCart(cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
      } else if (act === 'remove') {
        writeCart(cart.filter(i => i.id !== id));
      }
    });
  }

  // Header cart button opens the drawer
  document.querySelectorAll('.icon-btn').forEach(btn => {
    if (btn.getAttribute('aria-label') === 'View cart') {
      btn.addEventListener('click', openCart);
    }
  });

  // Add-to-cart buttons across the site
  document.querySelectorAll('.dish-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-id]');
      if (!card) return;
      const id = card.getAttribute('data-id');
      const item = CATALOG[id];
      if (!item) return;
      const cart = readCart();
      const found = cart.find(i => i.id === id);
      if (found) found.qty += 1;
      else cart.push({ id, name: item.name, price: item.price, qty: 1 });
      writeCart(cart);
      btn.style.transform = 'scale(0.85)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
      openCart();
    });
  });

  renderCart();

  /* ---------- Testimonial stacked deck ---------- */
  const deck = document.getElementById('testimonialDeck');
  if (deck) {
    const cards = Array.from(deck.querySelectorAll('.testimonial-card'));
    const total = cards.length;
    let order = cards.map((_, i) => i); // order[0] = index of front card

    const render = () => {
      order.forEach((cardIndex, pos) => {
        cards[cardIndex].setAttribute('data-pos', String(pos));
      });
    };

    document.getElementById('deckNext')?.addEventListener('click', () => {
      order.push(order.shift());
      render();
    });
    document.getElementById('deckPrev')?.addEventListener('click', () => {
      order.unshift(order.pop());
      render();
    });

    // Clicking a background card also brings it forward
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const pos = parseInt(card.getAttribute('data-pos'), 10);
        if (pos === 0) return;
        for (let i = 0; i < pos; i++) order.push(order.shift());
        render();
      });
    });
  }

  /* ---------- Count-up stats (landing + about) ---------- */
  const counters = document.querySelectorAll('.stat-count');
  if (counters.length) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const runCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-count')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      if (target === 0) { el.textContent = (0).toFixed(decimals); return; }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = (target * easeOut(p)).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(el => {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
    } else {
      const seen = new WeakSet();
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            runCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => counterObs.observe(el));
    }
  }

  /* ---------- About: founder card tilt on hover ---------- */
  const founderCards = document.querySelectorAll('.founder-card');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (founderCards.length && canHover && !motionReduced) {
    founderCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Landing: continuous wavy hero word ---------- */
  const waveHighlights = document.querySelectorAll('.highlight-wave');
  if (waveHighlights.length && !motionReduced) {
    waveHighlights.forEach(span => {
      const node = span.childNodes[0];
      if (!node || node.nodeType !== 3) return;
      const chars = node.textContent.trim().split('');
      const frag = document.createDocumentFragment();
      chars.forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'wave-char';
        s.style.setProperty('--i', String(i));
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        frag.appendChild(s);
      });
      span.replaceChild(frag, node);
    });
  } else if (motionReduced) {
    // Stillness requested: kill the SMIL underline morph too
    document.querySelectorAll('animate').forEach(a => a.remove());
  }

  /* ---------- Contact: FAQ accordion (one open at a time) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact: form submit → success ticket ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      contactForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Menu: category filter tabs ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuCards = document.querySelectorAll('.menu-card');
  if (filterTabs.length && menuCards.length) {
    const applyFilter = (f) => {
      filterTabs.forEach(t => {
        const on = t.getAttribute('data-filter') === f;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });
      menuCards.forEach(card => {
        const show = f === 'all' || card.getAttribute('data-cat') === f;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.classList.remove('card-in');
          void card.offsetWidth; // restart the entrance animation
          card.classList.add('card-in');
        }
      });
    };
    filterTabs.forEach(t => {
      t.setAttribute('aria-pressed', String(t.classList.contains('is-active')));
      t.addEventListener('click', () => applyFilter(t.getAttribute('data-filter')));
    });
    // Category cards filter the grid and scroll to it
    document.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        applyFilter(card.getAttribute('data-filter'));
      });
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Newsletter: instant confirmation ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button');
      const input = form.querySelector('input');
      if (!btn) return;
      btn.textContent = 'Joined ✓';
      btn.disabled = true;
      if (input) input.value = '';
      setTimeout(() => { btn.textContent = 'Join'; btn.disabled = false; }, 2400);
    });
  });

  /* ---------- Contact form success: announce to screen readers ---------- */
  if (formSuccess) formSuccess.setAttribute('role', 'status');

  /* ---------- Wavy words: keep them readable for screen readers ---------- */
  document.querySelectorAll('.highlight-wave').forEach(span => {
    const word = span.textContent.replace(/\s+/g, ' ').trim();
    if (!word) return;
    span.setAttribute('aria-label', word);
    span.querySelectorAll('.wave-char').forEach(ch => ch.setAttribute('aria-hidden', 'true'));
  });

});
