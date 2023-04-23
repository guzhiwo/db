const userList = document.getElementById('user_list')
const userItemDelete = document.getElementById('user_item_delete')

drivers.onclick = () => {
    getDriverList()
}
administrators.onclick = () => {
    getAdministratorsList()
}
go_back.onclick = () => {
    window.open('./index.html', '_self')
}

async function getDriverList() {
    userList.innerHTML = ''
    const response = await fetch(
        `${host}/account/getAll/drivers/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (result.isError) {
        showErrorBanner(result.message)
    }
    else {
        if (result.drivers.length == 0) {
            userList.innerHTML += `<div class='empty_user'>
            В аккаунте нет пользователей с ролью водитель.
        </div>`
        }
        result.drivers.forEach(user => {
            userList.innerHTML += `<div class='user_item'>
            <div class='user_item_login'>${user.login}</div>
            <div class='user_item_icons'>
                <div class='user_item_set_admin' user_id='${user.id}' onclick='setAdmin(this)'></div>
                <div id='user_item_delete' class='user_item_delete' user_id='${user.id}' onclick='deleteDriver(this)'></div>
            </div>
        </div>`
        })
    }
}

async function getAdministratorsList() {
    userList.innerHTML = ''
    const response = await fetch(
        `${host}/account/getAll/administrators/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (result.isError) {
        showErrorBanner(result.message)
    }
    else {
        if (result.administrators.length == 0) {
            userList.innerHTML += `<div class='empty_user'>
                В аккаунте нет пользователей с ролью администратор.
            </div>`
        }
        result.administrators.forEach(user => {
            userList.innerHTML += `<div class='user_item'>
                <div class='user_item_login'>${user.login}</div>
                <div class='user_item_icons'>
                    <div class='user_item_set_driver' user_id='${user.id}' onclick='setDriver(this)'></div>
                    <div id='user_item_delete' class='user_item_delete' user_id='${user.id}' onclick='deleteDriver(this)'></div>
                </div>
            </div>`
        })
    }
}

async function deleteDriver(element) {
    const popup = document.getElementById('delete_popup')
    openPopup(popup, body)
    delete_popup_cancel.onclick = async () => cancelPopup(popup, body)
    popup_delete_account.onclick = async () => {
        await request('/delete', element, popup)
    }
}

async function setAdmin(element) {
    const popup = document.getElementById('set_admin_popup')
    openPopup(popup, body)
    set_admin_popup_cancel.onclick = async () => cancelPopup(popup, body)
    popup_set_admin.onclick = async () => {
        await request('/set/admin', element, popup)
    }
}

async function setDriver(element) {
    const popup = document.getElementById('set_driver_popup')
    openPopup(popup, body)
    set_driver_popup_cancel.onclick = async () => cancelPopup(popup, body)
    popup_set_driver.onclick = async () => {
        await request('/set/driver', element, popup)
    }
}

async function request(uri, element, popup) {
    const userID = element.getAttribute('user_id')
    const response = await fetch(
        `${host}/account${uri}/${userID}/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()
    if (result.isError) {
        showErrorBanner(result.message)
    }
    else {
        element.parentNode.parentNode.remove()
    }
    cancelPopup(popup, body)
}