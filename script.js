document.addEventListener('DOMContentLoaded', () => {
/*--------------------------------------------------------------------------------------Менюшечка----------------------------------------------------------------------------*/
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
      if (!searchToggleBtn.contains(e.target) && !searchContainer.contains(e.target)) {
        searchContainer.classList.remove('open');
      }
    });
  }

/*--------------------------------------------------------------------------------------Скролл до футера----------------------------------------------------------------------------*/
  const contactsLink = document.querySelector('a.header__nav-link[href="#site-footer"]');
  contactsLink?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  });

/*--------------------------------------------------------------------------------------Дропдаун меню----------------------------------------------------------------------------*/
  const dropdownItems = document.querySelectorAll('.header__nav-item.dropdown');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.header__nav-link');
    trigger?.addEventListener('click', e => {
      e.preventDefault();
      dropdownItems.forEach(el => el.classList.remove('show'));
      item.classList.toggle('show');
    });
  });
  document.addEventListener('click', () => {
    dropdownItems.forEach(item => item.classList.remove('show'));
  });


  if (typeof showSection === 'function') showSection('hero');

/*--------------------------------------------------------------------------------------Зум в карточках---------------------------------------------------------------------------*/
  document.querySelectorAll('.product-card').forEach(card => {
    const wrapper = card.querySelector('.image-container');
    const img = wrapper?.querySelector('.product-image');
    if (wrapper && img) {
      wrapper.addEventListener('mousemove', e => {
        const { left, top, width, height } = wrapper.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        img.style.setProperty('--x', `${x}%`);
        img.style.setProperty('--y', `${y}%`);
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
      tip.style.cssText = `position:absolute; left:${btnRect.left - cardRect.left + btnRect.width / 2}px; top:${btnRect.top - cardRect.top}px;`;
      requestAnimationFrame(() => tip.classList.add('visible'));
      setTimeout(() => tip.classList.remove('visible'), 1500);
      setTimeout(() => tip.remove(), 1800);
    }
    card.querySelector('.btn-favorite')?.addEventListener('click', e => { e.preventDefault(); showTooltip(e.currentTarget, 'Добавлено в избранное'); });
    card.querySelector('.btn-add')?.addEventListener('click', e => { e.preventDefault(); showTooltip(e.currentTarget, 'Добавить в корзину'); });
  });

  /*--------------------------------------------------------------------------------------FAQ----------------------------------------------------------------------------*/
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(opened => opened.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /*--------------------------------------------------------------------------------------Продуктовая деталка----------------------------------------------------------------------------*/
  const productEl = document.querySelector('.main-product');
  if (productEl) {
  const sizeButtons = productEl.querySelectorAll('.sizes .size');
  const addBtn      = productEl.querySelector('#add-to-cart');
  const buyBtn      = productEl.querySelector('#buy-now');
  let selectedSize  = location.href.includes("/accs/") ? "S" : null;

    function clearActives() {
      sizeButtons.forEach(b => b.classList.remove('active', 'shake'));
    }

    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        clearActives();
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        if (addBtn) addBtn.disabled = false;
      });
    });
    addBtn?.addEventListener('click', e => {
      e.preventDefault();
      if (!selectedSize) {
        sizeButtons.forEach(b => { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 300); });
        return;
      }
      const name = productEl.querySelector('.product-title')?.innerText.trim();
      const priceText = productEl.querySelector('.price')?.innerText.trim() || '';
      const price = parseInt(priceText.replace(/\D/g, ''), 10) || 0;
      const link = window.location.href;
      const img = productEl.querySelector('.image-stack .stack-img.active')?.src || productEl.querySelector('.image-stack .stack-img')?.src;
      if (!name || !img) return;
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemInCart = cart.find(item => item.name === name && item.size === selectedSize);
      if (itemInCart) {
        itemInCart.quantity += 1
      } else {
        cart.push({ name, price, image: img, size: selectedSize, quantity: 1, link });
      } 
      localStorage.setItem('cart', JSON.stringify(cart));
      addBtn.innerText = 'Добавлено'; // setTimeout(()=>addBtn.innerText='В корзину',1000);
    });
    
      buyBtn?.addEventListener('click', e => {
        e.preventDefault();

        // Если размер не выбран — трясём кнопки размеров
        if (!selectedSize) {
          sizeButtons.forEach(b => {
            b.classList.add('shake');
            setTimeout(() => b.classList.remove('shake'), 300);
          });
          return; // дальше не идём, модалка не открывается
        }

        // Иначе — открываем модалку
        document.getElementById('purchase-modal')?.classList.add('open');
      });

  } 
});

/*--------------------------------------------------------------------------------------фото свайп---------------------------------------------------------------------------*/
window.addEventListener('load',()=>{
  const stack=document.querySelector('.image-stack');
  if(stack){
    const first=stack.querySelector('.stack-img'); first&&first.classList.add('active');
    stack.addEventListener('click',e=>{
      const img=e.target.closest('.stack-img'); if(!img)return;
      stack.querySelectorAll('.stack-img.active').forEach(el=>el.classList.remove('active'));
      img.classList.add('active');
    });
  }
 /* const modal=document.getElementById('purchase-modal');
  const buyNow=document.getElementById('buy-now');
  const closeBtn=document.querySelector('.modal-close');
  buyNow?.addEventListener('click',()=>modal.style.display='flex');
  closeBtn?.addEventListener('click',()=>modal.style.display='none');
  window.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none'; });*/
});

/*--------------------------------------------------------------------------------------модалка----------------------------------------------------------------------------*/
const buyBtns  = document.querySelectorAll('.buy-now'); 
const modal    = document.getElementById('purchase-modal');
const closeBtn = modal?.querySelector('.modal__close');

buyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const { id, name, price } = btn.dataset;
    modal.querySelector('#modal-product-id').value          = id;
    modal.querySelector('#modal-product-name').textContent  = name;
    modal.querySelector('#modal-product-price').textContent = price + ' ₽';
    modal.querySelector('#modal-product-price-input').value = price;
    modal.classList.add('open');
  });
});

closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('open');
});
