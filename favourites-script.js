const recalculateFavs = () => {
    const favSpace = document.getElementById("productInfo");
    const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    const cartSummary = document.getElementById("cart-summary");
    favSpace.innerHTML = '';
    if (favs?.length) {
        cartSummary.classList.remove("hidden");
        favs.forEach(item => {
            favSpace.innerHTML += `
            <div style="display: flex; flex-direction: row; align-items: start; gap: 20px; padding: 12px 0;">
            <a href="${item.link}"><img style="display: inline; width: 140px; height: 140px; color: rgb(210, 192, 255)" src="${item.image}"></a> 
                <div><span style="font-size: 1rem; font-weight: 600; color: rgb(210, 192, 255)">${item.name}</span><br>
                <button style="margin-top: 30px" onclick="deleteFromFavs('${item.name}')">Удалить из избранного</button></div>
                </div>
                `
        });
    } else {
        cartSummary.classList.add("hidden")
        favSpace.innerHTML = "В избранном пусто... <br><br><a href='./tshirts.html'><button class='btn btn-outline'>Перейти в каталог</button></a><img width='400' src='assets/йй.png'>"
    }

}

const deleteFromFavs = (name) => {
    const favs = JSON.parse(localStorage.getItem('favourites') || '[]').filter(item => item.name !== name);
    localStorage.setItem('favourites', JSON.stringify(favs))
    recalculateFavs()
}

document.addEventListener('DOMContentLoaded', () => {
    const clearCartBtn = document.getElementById("clearCartBtn")
    clearCartBtn.addEventListener('click', () => {
        localStorage.setItem("favourites", "[]");
        recalculateFavs();
    })
    recalculateFavs()
})
