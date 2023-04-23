const host = 'https://nyakatyan.ddns.net:5144'

const headers = {
    'accept': 'text/json',
    'Content-Type': 'application/json',
    'credentials': 'include'
}

function showErrorBanner(errorText) {
    const error = document.getElementById('error-message')

    error.style.display = 'block'
    error.textContent = errorText

    setTimeout(() => {
        error.style.display = 'none'
    }, 5000)
}

function showSuccessBanner(successText) {
    const success = document.getElementById('success-message')

    success.style.display = 'block'
    success.textContent = successText

    setTimeout(() => {
        success.style.display = 'none'
    }, 2000)
}
function showSimpleBanner(simpleText) {
    const simple = document.getElementById('simple-message')

    simple.style.display = 'block'
    simple.textContent = simpleText

    setTimeout(() => {
        simple.style.display = 'none'
    }, 2000)
}

function openMap(result) {
    localStorage.setItem('token', result.message)
    loginPopup.style.display = 'none'
    registerPopup.style.display = 'none'
    menuButton.style.display = 'block'
    body.style['pointer-events'] = 'auto'
}

function showMenuPopup(none, block) {
    if (block.style.display == 'block') {
        block.style.display = 'none'
        none.style.display = 'none'
    }
    else {
        block.style.display = 'block'
        none.style.display = 'none'
    }
}

function showAuthorisationPopup(block) {
    block.style.display = 'block'
    body.style['pointer-events'] = 'none'
    block.style['pointer-events'] = 'auto'
    accountPopup.style.display = 'none'
    menuButton.style.display = 'none'
}

function changeAuthorisationPopup(none, block) {
    block.style.display = 'block'
    block.style['pointer-events'] = 'auto'
    none.style.display = 'none'
}

async function isAdmin() {
    const response = await fetch(
        `${host}/account/check/admin/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (!result.isAdmin) {
        window.open('./index.html', '_self')
        showErrorBanner('Недостаточно прав')
    }
    else {
        if (window.location.pathname === '/users.html') {
            getDriverList()
        }
    }
}

async function cancelPopup(popup, back) {
    popup.style.display = 'none'
    back.style['pointer-events'] = 'auto'
}

async function openPopup(popup, back) {
    popup.style.display = 'block'
    popup.style['pointer-events'] = 'auto'
    back.style['pointer-events'] = 'none'
}