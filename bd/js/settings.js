delete_button.onclick = async () => {
    let popup = document.getElementById('delete_popup')
    popup.style.display = 'block'
    settingsPopup.style['pointer-events'] = 'none'
    popup.style['pointer-events'] = 'auto'
    
}

popup_cancel.onclick = async () => {
    let popup = document.getElementById('delete_popup')
    popup.style.display = 'none'
    popup.style['pointer-events'] = 'auto'
    settingsPopup.style['pointer-events'] = 'auto'
}

popup_delete_account.onclick = async () => {
    let response = await fetch(
        `${host}/account/delete/${localStorage.getItem('token')}`, 
        {
        method: 'GET',
        headers: {
            'accept': 'text/json',
            'Content-Type': 'application/json',
            'credentials': 'include'
        }
    })
    let result = await response.json()
    localStorage.removeItem('token')
    let popup = document.getElementById('delete_popup')
    popup.style.display = 'none'
    window.open('../html/map(z).html', '_self')
}

save_changes.onclick = async () => {
    const repeatPassword = document.getElementById('settings_popup_r_password').value == '' ? null : document.getElementById('rep_pass').value

    const data = {
        id: 6,
        'name': document.getElementById('name').value == '' ? null : document.getElementById('name').value,
        'login': document.getElementById('settings_popup_login').value == '' ? null : document.getElementById('login').value,
        'password': document.getElementById('settings_popup_password').value == '' ? null : document.getElementById('pass').value,
        'telephone': document.getElementById('settings_popup_tel').value == '' ? null : document.getElementById('tel').value,
        'license': document.getElementById('settings_popup_license').value == '' ? null : document.getElementById('license').value,
    }

    console.log()
    if (data.password === repeatPassword) {
        const response = await fetch(
            `${host}/account/change/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            })
        const result = await response.json()

        window.open('../html/map(z).html', '_self')
    }
}

async function fillPlaceholder() {
    const response = await fetch(
        `${host}/account/get/token/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    document.getElementById('name').placeholder = result.name
    document.getElementById('login').placeholder = result.login
    document.getElementById('tel').placeholder = result.telephone === '' ? document.getElementById('tel').placeholder : result.telephone
    document.getElementById('license').placeholder = result.license
}

cancel.onclick = async () => {
    settingsPopup.style.display = 'none'
    menuButton.style.display = 'block'
    body.style['pointer-events'] = 'auto'
}

settings_popup_logout.onclick = async () => {
    localStorage.removeItem('token') 
    settingsPopup.style.display = 'none'
    menuButton.style.display = 'block'
    body.style['pointer-events'] = 'auto'
}

profile_popup_settings.onclick = async () => {
    settingsPopup.style.display = 'block'
    body.style['pointer-events'] = 'none'
    settingsPopup.style['pointer-events'] = 'auto'
    profilePopup.style.display = 'none'
    menuButton.style.display = 'none'
}