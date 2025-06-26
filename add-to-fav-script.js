const addToFavourites = ({name, image, link}) => {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    if (!favourites.find(item => item.name === name)) {
        favourites.push({name, image, link})
    }
    localStorage.setItem('favourites', JSON.stringify(favourites))
}