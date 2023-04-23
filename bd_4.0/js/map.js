const accountPopup = document.getElementById('authorisation_popup')
const profilePopup = document.getElementById('profile_popup')
const settingsPopup = document.getElementById('settings_popup')
const menuButton = document.getElementById('menu_button')
const loginPopup = document.getElementById('login_popup')
const registerPopup = document.getElementById('register_popup')
const body = document.getElementById('body')
const getUserButton = document.getElementById('popup_users')
const getCarButton = document.getElementById('popup_cars')
const getShelterButton = document.getElementById('popup_shelters')
const create = document.getElementById('create_itinerary')
const edit = document.getElementById('edit')
const transport = document.getElementById('transport')
const transportList = document.getElementById('transport_list')

menu_button.onclick = async () => {
    if (localStorage.getItem('token') === null || '') {
        displayAutorisationPopup()
    }
    else {
        const response = await fetch(
            `${host}/account/get/token/${localStorage.getItem('token')}`,
            {
                headers: headers
            }
        )
        const result = await response.json()
        displayProfilePopup(result)
    }
}

popup_logout.onclick = async () => {
    localStorage.removeItem('token')
    accountPopup.style.display = 'none'
    profilePopup.style.display = 'none'
    transport.style.display= "none"
    transportList.style.display= "none"
    showSimpleBanner('Вы вышли из аккаунта')
}

create_itinerary.onclick = async () => {
    const popup = document.getElementById('create_itinerary_popup')
    openPopup(popup, body)

    document.getElementById('create_itinerary_popup_name').value = ''

    create_itinerary_popup_create.onclick = async () => {
        const name = document.getElementById('create_itinerary_popup_name').value

        const response = await fetch(
            `${host}/itinerary/add/${name}/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                headers: headers,
            })
        const result = await response.json()
        if (result.isError) {
            showErrorBanner(result.message)
        }
        else {
            const response = await fetch(
                `${host}/itinerary/getAll`,
                {
                    headers: headers,
                })
            const listResult = await response.json()
            localStorage.setItem('id_itinerary', listResult.itinerary.find(x => x.name === name).id)
            cancelPopup(popup, body)
            showSuccessBanner('Маршрут успешно добавлен')
            window.open('./itinerary.html')
        }
    }

    create_itinerary_popup_cancel.onclick = () => {
        cancelPopup(popup, body)
    }
}

async function getButtons() {
    const telephoneField = document.getElementById('profile_telephone')
    const licenseField = document.getElementById('profile_license')

    const response = await fetch(
        `${host}/account/check/admin/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (result.isAdmin) {
        getCarButton.remove()
        licenseField.parentNode.remove()
        telephoneField.parentNode.remove()
        transport.remove()
        transportList.remove()

        popup_users.onclick = () => {
            window.open('./users.html', '_self')
        }
        popup_shelters.onclick = () => {
            window.open('./shelters.html', '_self')
        }
    }
    else {
        getUserButton.remove()
        getShelterButton.remove()
        edit.remove()
        create.remove()
        if(localStorage.getItem('token') !== null) {
            transport.style.display= "flex"
            transportList.style.display= "flex"
        }
        
        popup_cars.onclick = () => {
            window.open('./cars.html', '_self')
        }
    }
}

async function displayProfilePopup(result) {
    const response = await fetch(
        `${host}/account/check/admin/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const isAdminResult = await response.json()

    if (!isAdminResult.isAdmin) {
        document.getElementById('profile_telephone').innerHTML = result.telephone
        document.getElementById('profile_license').innerHTML = result.license
    }
    document.getElementById('profile_name').innerHTML = result.name
    document.getElementById('profile_login').innerHTML = result.login

    showMenuPopup(accountPopup, profilePopup)
}

function displayAutorisationPopup() {
    showMenuPopup(profilePopup, accountPopup)
}

function showCreateIteneraryButton() {
    const create = document.getElementById('create_itinerary')
    const edit = document.getElementById('edit')

    if(!edit.disabled) {
        create.disabled = true
    }
    else {
        create.disabled = false
    }
}

itinerary.onclick = () => {
    if(!edit.disabled) {
        create.disabled = true
    }
    else {
        create.disabled = false
    }
}

