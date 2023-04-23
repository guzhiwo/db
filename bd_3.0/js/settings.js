const deletePopup = document.getElementById('delete_popup')
const nameField = document.getElementById('settings_popup_name')
const loginField = document.getElementById('settings_popup_login')
const passwordField = document.getElementById('settings_popup_password')
const repearPasswordField = document.getElementById('settings_popup_r_password')
const telephoneField = document.getElementById('settings_popup_tel')
const licenseField = document.getElementById('settings_popup_license')

delete_button.onclick = async () => {
    openPopup(deletePopup, settingsPopup)
}
popup_cancel.onclick = async () => {
    cancelPopup(deletePopup, settingsPopup)
}

popup_delete_account.onclick = async () => {
    const response = await fetch(
        `${host}/account/delete/${localStorage.getItem('token')}`,
        {
            method: 'GET',
            headers: headers,
        }
    )
    const result = await response.json()

    if (result.isError) {
        cancelPopup(deletePopup, settingsPopup)
        showErrorBanner(result.message)
    }
    else {
        localStorage.removeItem('token')
        cancelPopup(deletePopup, settingsPopup)
        setTimeout(() => {
            // location.reload()
        window.open('./index.html', '_self')

        }, 2000)
        showSuccessBanner('Аккаунт успешно удален')
    }
}

save_changes.onclick = async () => {
    const getUserResponse = await fetch(
        `${host}/account/get/token/${localStorage.getItem('token')}`,
        {
            headers: headers
        }
    )
    const getUserResult = await getUserResponse.json()

    const data = {
        id: getUserResult.id,
        name: nameField.value == '' ? null : nameField.value,
        login: loginField.value == '' ? null : loginField.value,
        password: passwordField.value == '' ? null : passwordField.value,
        telephone: telephoneField.value == '' ? null : telephoneField.value,
        license: licenseField.value == '' ? null : licenseField.value,
    }
    const repeatPassword = repearPasswordField.value == '' ? null : repearPasswordField.value

    if (data.password === repeatPassword) {
        const response = await fetch(
            `${host}/account/change/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            }
        )
        const result = await response.json()
        if (result.isError) {
            showErrorBanner(result.message)
        }
        // location.reload()
        window.open('./index.html', '_self')

    }
}

cancel.onclick = async () => {
    menuButton.style.display = 'block'
    cancelPopup(settingsPopup, body)
}

settings_popup_logout.onclick = async () => {
    localStorage.removeItem('token')
    menuButton.style.display = 'block'
    cancelPopup(settingsPopup, body)
    showSimpleBanner('Вы вышли из аккаунта')
}

profile_popup_settings.onclick = async () => {
    const response = await fetch(
        `${host}/account/check/admin/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()
    if (result.isAdmin) {
        telephoneField.parentNode.remove()
        licenseField.parentNode.remove()
    }
    fillPlaceholder(result.isAdmin)

    openPopup(settingsPopup, body)
    profilePopup.style.display = 'none'
    menuButton.style.display = 'none'
}

async function fillPlaceholder(isAdmin) {
    const response = await fetch(
        `${host}/account/get/token/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (!isAdmin) {
        setPlaceholder(result.telephone, 'settings_popup_tel', document.getElementById('settings_popup_tel').placeholder)
        setPlaceholder(result.license, 'settings_popup_license')
    }
    setPlaceholder(result.name, 'settings_popup_name')
    setPlaceholder(result.login, 'settings_popup_login')
}

function setPlaceholder(value, id, placeholder = '') {
    value === null
        ? document.getElementById(id).placeholder = placeholder
        : document.getElementById(id).placeholder = value
}