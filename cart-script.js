document.addEventListener('DOMContentLoaded', () => {
    const cartSpace = document.getElementById("productInfo");
    const totalLabel = document.getElementById("totalAmount");
    const clearCartBtn = document.getElementById("clearCartBtn")

    clearCartBtn.addEventListener('click', () => {
        localStorage.setItem("cart", "[]");
        cartSpace.innerHTML = '';
        recalculateCart();
    })

    const recalculateCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log(cart)

        const total = cart.reduce((acc, current) => Number(current.price) * Number(current.quantity) + acc, 0)
        totalLabel.innerHTML = total + ' ₽';

        cart.forEach(item => {
            cartSpace.innerHTML += `<a href="${item.link}"><img style="display: inline; width: 100px; height: 100px;" src="${item.image}"></a> ${item.name} ${item.size} x${item.quantity}<br>`
        });

    }

    recalculateCart()
})