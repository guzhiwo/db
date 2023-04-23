submit_login.onclick = async () => {
    const data = {
        login: document.getElementById('login_popup_login').value,
        password: document.getElementById('login_popup_password').value
    }
    const response = await fetch(
        `${host}/autentication`,
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
    else {
        openMap(result)
        showSuccessBanner('Логинация прошла успешно')
        setTimeout(() => {
            window.open('./index.html', '_self')
        }, 2000)
    }
}

authorisation_popup_login.onclick = () => {
    showAuthorisationPopup(loginPopup)
}

register_popup_login_in_account.onclick = () => {
    changeAuthorisationPopup(registerPopup, loginPopup)
}