const recalculateFavs = () => {
    const favSpace = document.getElementById("productInfo");
    const favs = JSON.parse(localStorage.getItem('favourites') || '[]');

    favSpace.innerHTML = '';
    favs.forEach(item => {
        favSpace.innerHTML += `
            <div style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
            <a href="${item.link}"><img style="display: inline; width: 140px; height: 140px;" src="${item.image}"></a> 
                <span>${item.name}</span>
                <button style="margin-left: 30px" onclick="deleteFromFavs('${item.name}')">Удалить из избранного</button>
                </div>
                `
    });

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
