register_submit.onclick = async () => {
    const repeatPassword = document.getElementById('register_popup_r_password').value
    const data = {
        name: document.getElementById('register_popup_name').value,
        login: document.getElementById('register_popup_login').value,
        telephone: document.getElementById('register_popup_telephone').value,
        license: document.getElementById('register_popup_license').value,
        password: document.getElementById('register_popup_password').value,
    }

    if (data.password === repeatPassword) {
        const response = await fetch(
            `${host}/registration`,
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
            showSuccessBanner('Регистрация прошла успешно')
        }
    }
    else {
        if (repeatPassword === '') {
            showErrorBanner('Введите пароль еще раз')
        }
        else {
            showErrorBanner('Пароли не совпадают')
        }
    }
}

authorisation_popup_register.onclick = () => {
    showAuthorisationPopup(registerPopup)
}

login_popup_register.onclick = () => {
    changeAuthorisationPopup(loginPopup, registerPopup)
}