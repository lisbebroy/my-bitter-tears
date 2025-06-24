// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Toggle Search
  const searchToggleBtn = document.getElementById('search-toggle');
  const searchContainer = document.getElementById('search-container');
  if (searchToggleBtn && searchContainer) {
    searchToggleBtn.addEventListener('click', e => {
      e.preventDefault();
      searchContainer.classList.toggle('open');
      if (searchContainer.classList.contains('open')) {
        searchContainer.querySelector('.header__search-input')?.focus();
      }
    });
    document.addEventListener('click', e => {
      if (
        !searchToggleBtn.contains(e.target) &&
        !searchContainer.contains(e.target)
      ) {
        searchContainer.classList.remove('open');
      }
    });
  }

  // 2) Smooth scroll to footer
  const contactsLink = document.querySelector(
    'a.header__nav-link[href="#site-footer"]'
  );
  contactsLink?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  });

  // 3) Dropdown menus
  const dropdownItems = document.querySelectorAll('.header__nav-item.dropdown');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.header__nav-link');
    trigger?.addEventListener('click', e => {
      e.preventDefault();
      // close others
      dropdownItems.forEach(el => {
        if (el !== item) el.classList.remove('show');
      });
      item.classList.toggle('show');
    });
  });
  document.addEventListener('click', () => {
    dropdownItems.forEach(item => item.classList.remove('show'));
  });

  // 4) Section navigation
  showSection('hero');

  // 5) Product card zoom & tooltips
  document.querySelectorAll('.product-card').forEach(card => {
    const wrapper = card.querySelector('.image-container');
    const img = wrapper?.querySelector('.product-image');
    if (wrapper && img) {
      wrapper.addEventListener('mousemove', e => {
        const { left, top, width, height } = wrapper.getBoundingClientRect();
        img.style.setProperty('--x', `${((e.clientX - left) / width) * 100}%`);
        img.style.setProperty('--y', `${((e.clientY - top) / height) * 100}%`);
      });
      wrapper.addEventListener('mouseleave', () => {
        img.style.setProperty('--x', '50%');
        img.style.setProperty('--y', '50%');
      });
    }

    function showTooltip(button, text) {
      card.querySelector('.tooltip')?.remove();
      const tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.innerText = text;
      card.appendChild(tip);
      const btnRect = button.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      tip.style.cssText = `
        position:absolute;
        left:${btnRect.left - cardRect.left + btnRect.width/2}px;
        top:${btnRect.top - cardRect.top}px;
      `;
      requestAnimationFrame(() => tip.classList.add('visible'));
      setTimeout(() => tip.classList.remove('visible'), 1500);
      setTimeout(() => tip.remove(), 1800);
    }

    card.querySelector('.btn-favorite')?.addEventListener('click', e => {
      e.preventDefault();
      showTooltip(e.currentTarget, 'Добавлено в избранное');
    });
    card.querySelector('.btn-add')?.addEventListener('click', e => {
      e.preventDefault();
      showTooltip(e.currentTarget, 'Добавить в корзину');
    });
  });

  // 6) FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(opened => {
        opened.classList.remove('active');
      });
      if (!isActive) item.classList.add('active');
    });
  });
(function() {
    const sizeButtons = document.querySelectorAll('.sizes .size');
    const addToCartBtn = document.getElementById('add-to-cart');
    let selectedSize = null;

    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        addToCartBtn.disabled = false;
      });
    });

    addToCartBtn?.addEventListener('click', e => {
      e.preventDefault();
      if (!selectedSize) return;
      const name = document.querySelector('.product-title')?.innerText.trim();
      const priceText = document.querySelector('.price')?.innerText.trim() || '';
      const price = parseInt(priceText.replace(/\D/g, ''), 10) || 0;
      const image = document.querySelector('.image-stack .stack-img.active')?.src
                     || document.querySelector('.image-stack .stack-img')?.src;
      if (!name || !image) return;

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name, price, image, size: selectedSize, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));

      // фидбэк по кнопке
      addToCartBtn.innerText = 'Добавлено';
      setTimeout(() => addToCartBtn.innerText = 'В корзину', 1000);
    });
  })();

  // 7) Product detail: выбор размера и добавление в корзину
  const detailSizeButtons = document.querySelectorAll('.sizes .size');
  const detailAddBtn = document.getElementById('add-to-cart');
  let chosenSize = null;
  if (detailSizeButtons.length && detailAddBtn) {
    detailSizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        detailSizeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        chosenSize = btn.dataset.size;
        detailAddBtn.disabled = false;
      });
    });
    detailAddBtn.addEventListener('click', e => {
      e.preventDefault();
      if (!chosenSize) return;
      const title = document.querySelector('.product-title')?.innerText.trim();
      const priceStr = document.querySelector('.price')?.innerText.trim() || '';
      const price = parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
      const activeImg = document.querySelector('.image-stack .stack-img.active');
      const defaultImg = document.querySelector('.image-stack .stack-img');
      const imgSrc = (activeImg || defaultImg)?.src;
      if (!title || !imgSrc) return;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name: title, price, image: imgSrc, size: chosenSize, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      detailAddBtn.innerText = 'Добавлено';
      setTimeout(() => { detailAddBtn.innerText = 'В корзину'; }, 1000);
    });
  }

  // 8) Shopping cart: add items from product listings
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-name')?.innerText.trim();
      const priceStr = card.querySelector('.product-price')?.innerText.trim() || '';
      const price = parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
      const img = card.querySelector('.product-image')?.src;
      if (!name || !img) return;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name, price, image: img });
      localStorage.setItem('cart', JSON.stringify(cart));
    });
  });

  // 9) Shopping cart: render & controls
  (function() {
    const productInfo = document.getElementById('productInfo');
    const totalSpan = document.getElementById('totalAmount');
    const clearBtn = document.getElementById('clearCartBtn');
    const orderBtn = document.getElementById('orderBtn');

    function renderCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!productInfo) return;
      if (!cart.length) {
        productInfo.innerHTML = '<p>Корзина пуста</p>';
        totalSpan.textContent = '0 ₽';
        return;
      }
      productInfo.innerHTML = cart.map((item, idx) => `
        <div class="cart-item" data-index="${idx}">
          <img src="${item.image}" alt="${item.name}" class="cart-image" />
          <div class="panel-details">
            <h2>${item.name}</h2>
            <p class="price">${item.price.toLocaleString()} ₽</p>
            <div class="size-options">
              ${['S','M','L'].map(s => `
                <input type="radio" id="size_${idx}_${s}" name="size_${idx}" value="${s}" ${item.size === s ? 'checked' : ''}/>
                <label for="size_${idx}_${s}">${s}</label>
              `).join('')}
            </div>
            <div class="qty-control">
              <button class="qty-decr" data-index="${idx}">−</button>
              <span class="qty-value" data-index="${idx}">${item.quantity||1}</span>
              <button class="qty-incr" data-index="${idx}">+</button>
            </div>
            <button class="btn-remove" data-index="${idx}">Удалить</button>
          </div>
        </div>
      `).join('');
      productInfo.querySelectorAll('.btn-remove').forEach(b => b.addEventListener('click', onRemove));
      productInfo.querySelectorAll('.size-options input').forEach(r => r.addEventListener('change', onSizeChange));
      productInfo.querySelectorAll('.qty-incr, .qty-decr').forEach(b => b.addEventListener('click', onQtyChange));
      updateTotal();
    }

    function onRemove(e) {
      e.stopPropagation();
      const idx = +e.target.dataset.index;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }

    function onSizeChange(e) {
      const idx = +e.target.name.split('_')[1];
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart[idx].size = e.target.value;
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    function onQtyChange(e) {
      e.stopPropagation();
      const idx = +e.target.dataset.index;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      let qty = cart[idx].quantity || 1;
      qty += e.target.classList.contains('qty-incr') ? 1 : -1;
      cart[idx].quantity = Math.max(qty, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      document.querySelector(`.qty-value[data-index="${idx}"]`).textContent = cart[idx].quantity;
      updateTotal();
    }

    function updateTotal() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, it) => sum + it.price * (it.quantity||1), 0);
      totalSpan.textContent = total.toLocaleString() + ' ₽';
    }

    clearBtn?.addEventListener('click', () => {
      localStorage.removeItem('cart');
      renderCart();
    });
    orderBtn?.addEventListener('click', () => alert('Переход к оформлению заказа'));

    renderCart();
  })();
});

window.addEventListener('load', () => {
  const stack = document.querySelector('.image-stack');
  if (stack) {
    const firstImg = stack.querySelector('.stack-img');
    if (firstImg) firstImg.classList.add('active');
    stack.addEventListener('click', e => {
      const img = e.target.closest('.stack-img');
      if (!img) return;
      stack.querySelectorAll('.stack-img.active').forEach(el => el.classList.remove('active'));
      img.classList.add('active');
    });
  }
  const modal = document.getElementById('buy-modal');
  const buyNow = document.getElementById('buy-now');
  const closeBtn = document.querySelector('.modal-close');
  if (buyNow && modal) buyNow.addEventListener('click', () => modal.style.display = 'flex');
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
});









/*-----------------------------------------------------------------------------------------------------------------*/
 // КАРТОЧКА: переключение active на image-stack
const sizeButtons = document.querySelectorAll('.sizes .size');
  const addToCartBtn = document.getElementById('add-to-cart');
  let selectedSize = null;

  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      addToCartBtn.disabled = false;
    });
  });

  addToCartBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!selectedSize) return;
    const name = document.querySelector('.product-title')?.innerText.trim();
    const priceText = document.querySelector('.price')?.innerText.trim() || '';
    const price = parseInt(priceText.replace(/\D/g, ''), 10) || 0;
    const image = document.querySelector('.image-stack .stack-img.active')?.src
                   || document.querySelector('.image-stack .stack-img')?.src;
    if (!name || !image) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, image, size: selectedSize, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    addToCartBtn.innerText = 'Добавлено';
    setTimeout(() => addToCartBtn.innerText = 'В корзину', 1000);
  });

// КАРТОЧКА: переключение active на image-stack + модалка Buy Now
window.addEventListener('load', () => {
  const stack = document.querySelector('.image-stack');
  if (stack) {
    const first = stack.querySelector('.stack-img');
    if (first) first.classList.add('active');

    stack.addEventListener('click', e => {
      const img = e.target.closest('.stack-img');
      if (!img) return;
      stack.querySelectorAll('.stack-img.active')
        .forEach(el => el.classList.remove('active'));
      img.classList.add('active');
    });
  }

  // модалка
  const modal = document.getElementById('buy-modal');
  const buyBtn = document.getElementById('buy-now');
  const closeBtn = document.querySelector('.modal-close');
  if (buyBtn && modal) {
    buyBtn.addEventListener('click', () => modal.style.display = 'flex');
  }
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});