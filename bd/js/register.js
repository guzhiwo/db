register_submit.onclick = async () => {
    const repeatPassword = document.getElementById('register_popup_r_password').value
    const data = {
        login: document.getElementById('register_popup_login').value,
        password: document.getElementById('register_popup_password').value
    }

    if (data.password === repeatPassword) {
        const response = await fetch(
            `${host}/registration`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            })
        const result = await response.json()

        if (result.isError) {
            showError(result.message)
        }
        else {
            localStorage.setItem('token', result.message)
            window.open('../html/map(z).html', '_self')
        }
    }
    else {
        if (repeatPassword === '') {
            showError('Введите пароль еще раз')
        }
        else {
            showError('Пароли не совпадают')
        }
    }
}

authorisation_popup_register.onclick = () => {
    registerPopup.style.display = 'block'
    body.style['pointer-events'] = 'none'
    registerPopup.style['pointer-events'] = 'auto'
    accountPopup.style.display = 'none'
    menuButton.style.display = 'none'
}

login_popup_register.onclick = () => {
    registerPopup.style.display = 'block'
    registerPopup.style['pointer-events'] = 'auto'
    loginPopup.style.display = 'none'
}

function showError(errorText) {
    let error = document.getElementById('error-message')

    error.style.display = 'block'
    error.textContent = errorText

    setTimeout(() => {
        error.style.display = 'none'
    }, 5000)
}