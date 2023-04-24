delete_itinerary.onclick = async () => {
    const response = await fetch(
        `${host}/itinerary/remove/${localStorage.getItem('id_itinerary')}/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()
    if (result.isError) {
        showErrorBanner(result.message)
    }
    else {
        showSuccessBanner('Маршрут удален')
        window.open('./index.html', '_self')
    }
    cancelPopup(popup, body)
}