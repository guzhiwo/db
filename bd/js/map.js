
let accountPopup = document.getElementById('authorisation_popup')
let profilePopup = document.getElementById('profile_popup')
let settingsPopup = document.getElementById('settings_popup')
let menuButton = document.getElementById('menu_button')
let loginPopup = document.getElementById('login_popup')
let registerPopup = document.getElementById('register_popup')
let body = document.getElementById('body')

menu_button.onclick = async () => {
    if (localStorage.getItem('token') == null || '') {
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
    document.getElementById('authorisation_popup').style.display = 'none'
    document.getElementById('profile_popup').style.display = 'none'
}

function displayAutorisationPopup() {
    if (accountPopup.style.display == 'block') {
        accountPopup.style.display = 'none'
        profilePopup.style.display = 'none'
    }
    else {
        accountPopup.style.display = 'block'
        profilePopup.style.display = 'none'
    }
}

function displayProfilePopup(result) {
    document.getElementById('profile_name').innerHTML = result.name
    document.getElementById('profile_login').innerHTML = result.login
    document.getElementById('profile_telephone').innerHTML = result.telephone
    document.getElementById('profile_license').innerHTML = result.license

    if (profilePopup.style.display == 'block') {
        profilePopup.style.display = 'none'
        accountPopup.style.display = 'none'
    }
    else {
        profilePopup.style.display = 'block'
        accountPopup.style.display = 'none'
    }
}
