const recalculateCart = () => {
    const cartSpace = document.getElementById("productInfo");
    const cartSummary = document.getElementById("cart-summary");
    const totalLabel = document.getElementById("totalAmount");
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const total = cart.reduce((acc, current) => Number(current.price) * Number(current.quantity) + acc, 0)
    totalLabel.innerHTML = total + ' ₽';
    cartSpace.innerHTML = '';
    if (cart.length) {
        cartSummary.classList.remove("hidden");
        cart.forEach(item => {
            cartSpace.innerHTML += `
            <div style="display: flex; align-items: start; gap: 12px; padding: 12px 0; border-bottom: 1px solidrgb(0, 0, 0);">
                <a href="${item.link}" style="flex-shrink: 0;">
                    <img src="${item.image}" alt="${item.name}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 8px;">
                </a>
                <div style="display: flex; flex-direction: column; gap: 4px; flex: 1">
                    <span style="font-size: 1rem; font-weight: 600; color: rgb(210, 192, 255)">${item.name}</span>
                    <span style="font-size: 0.95rem; color: rgb(210, 192, 255, 0.8); padding-top: 14px">${item.price} ₽</span>
                    <span style="font-size: 0.95rem; color: rgb(210, 192, 255, 0.8); padding-bottom: 20px">Размер: ${item.size}</span>
                    <div style="display: flex; align-items: center; gap: 12px; font-size: 1.2rem; ">
                    <button onclick="decrement('${item.name}', '${item.size}')" style="width: 32px; height: 32px; border: 1px solid #D2C0FF; border-radius: 4px; cursor: pointer;">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="increment('${item.name}', '${item.size}')" style="width: 32px; height: 32px; border: 1px solid #D2C0FF; border-radius: 4px; cursor: pointer;">+</button>
                </div>
                </div>
                
            </div>

                `
        });
    } else {
        cartSummary.classList.add("hidden")
        cartSpace.innerHTML = "В корзине пусто... <br><br><a href='./tshirts.html'><button class='btn btn-outline'>Перейти в каталог</button></a><img width='400' src='assets/йй.png'>"
    }

}

const increment = (name, size) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.find(item => item.name === name && item.size === size).quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart))
    recalculateCart()
}

const decrement = (name, size) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.name === name && item.size === size);
    if (item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart))
    } else {
        const newCart = cart.filter(item => item.name !== name || item.size !== size)
        localStorage.setItem('cart', JSON.stringify(newCart))
    }
    recalculateCart()
}

document.addEventListener('DOMContentLoaded', () => {
    const clearCartBtn = document.getElementById("clearCartBtn")

    clearCartBtn.addEventListener('click', () => {
        localStorage.setItem("cart", "[]");
        recalculateCart();
    })
    recalculateCart()
})
