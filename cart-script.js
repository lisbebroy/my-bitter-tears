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
            <div style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
            <a href="${item.link}"><img style="display: inline; width: 140px; height: 140px;" src="${item.image}"></a> 
                <span>${item.name} ${item.size}</span>
                <span style="font-size: 20px; display: flex; flex-direction: row; align-items: center; gap: 12px;">
                <button onclick="decrement('${item.name}', '${item.size}')">-</button>
                    ${item.quantity}
                <button onclick="increment('${item.name}', '${item.size}')">+</button>
                </span>
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
