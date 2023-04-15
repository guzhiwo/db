submit_login.onclick = async () => {
    const data = {
        login: document.getElementById('login_popup_login').value,
        password: document.getElementById('login_popup_password').value
    }
    let response = await fetch(
        `${host}/autentication`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        })
    let result = await response.json()
    console.log(result)
    if (result.isError) {
        let error = document.getElementById('error-message')
        error.style.display = 'block'
        error.textContent = `${result.message}`
        setTimeout(() => {
            error.style.display = 'none'
        }, 5000)
    }
    else {
        localStorage.setItem('token', result.message)
        window.open('../html/map(z).html', '_self')
    }
}

authorisation_popup_login.onclick = async () => {
    loginPopup.style.display = 'block'
    body.style['pointer-events'] = 'none'
    loginPopup.style['pointer-events'] = 'auto'
    accountPopup.style.display = 'none'
    menuButton.style.display = 'none'
}

register_popup_login_in_account.onclick = async () => {
    loginPopup.style.display = 'block'
    loginPopup.style['pointer-events'] = 'auto'
    registerPopup.style.display = 'none'
}