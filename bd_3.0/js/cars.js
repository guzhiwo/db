const carList = document.getElementById('car_list')
const carItemDelete = document.getElementById('car_item_delete')

async function isDriver() {
    const response = await fetch(
        `${host}/account/check/admin/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()

    if (!result.isAdmin) {
        getCarsList()
    }
    else {
        window.open('./index.html', '_self')
        showErrorBanner('Необходимо именть роль водитель')
    }
}

go_back.onclick = () => {
    window.open('./index.html', '_self')
}

add_car.onclick = async () => {
    const popup = document.getElementById('add_car_popup')
    popup.style.display = 'block'

    document.getElementById('add_car_popup_name').value = ''
    document.getElementById('add_car_popup_number').value = ''
    document.getElementById('add_car_popup_color').value = ''

    popup_add.onclick = async () => {
        const data = {
            name: document.getElementById('add_car_popup_name').value,
            number: document.getElementById('add_car_popup_number').value,
            color: document.getElementById('add_car_popup_color').value,
        }

        const response = await fetch(
            `${host}/transport/add/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            })
        const result = await response.json()
        if (result.isError) {
            showErrorBanner(result.message)
        }
        else {
            getCarsList()
            popup.style.display = 'none'
            showSuccessBanner('Транспорт успешно добавлен')
        }
    }

    add_car_popup_cancel.onclick = () => {
        popup.style.display = 'none'
    }
}

async function getCarsList() {
    carList.innerHTML = ''
    const response = await fetch(
        `${host}/account/get/car/token/${localStorage.getItem('token')}`,
        {
            headers: headers,
        }
    )
    const result = await response.json()
    result.transports.forEach(car => {
        carList.innerHTML += `<div class='car_item'>
            <div class='car_item_name car_item_elem'>${car.name}</div>
            <div class='car_item_number car_item_elem'>${car.number}</div>
            <div class='car_item_color car_item_elem'>${car.color}</div>
            <div class='car_item_icons car_item_elem'>
                <div class='car_item_edit' car_id='${car.id}' onclick='editCar(this)'></div>
                <div id='car_item_delete' class='car_item_delete' car_id='${car.id}' onclick='deleteCar(this)'></div>
            </div>
        </div>`
    })
}

async function editCar(element) {
    const popup = document.getElementById('edit_car_popup')
    openPopup(popup, body)

    const response = await fetch(
        `${host}/transport/get/${element.getAttribute('car_id')}`,
        {
            headers: headers,
        })
    const result = await response.json()

    document.getElementById('edit_car_popup_name').value = result.name
    document.getElementById('edit_car_popup_number').value = result.number
    document.getElementById('edit_car_popup_color').value = result.color

    popup_edit.onclick = async () => {
        const data = {
            id: element.getAttribute('car_id'),
            name: document.getElementById('edit_car_popup_name').value,
            number: document.getElementById('edit_car_popup_number').value,
            color: document.getElementById('edit_car_popup_color').value,
        }

        const response = await fetch(
            `${host}/transport/update/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            })
        const result = await response.json()

        if (result.isError) {
            showErrorBanner(result.message)
        }
        else {
            getCarsList()
            cancelPopup(popup, body)
            showSuccessBanner('Транспорт успешно изменен')
        }
    }

    edit_car_popup_cancel.onclick = () => {
        cancelPopup(popup, body)
    }
}

async function deleteCar(element) {
    const popup = document.getElementById('delete_popup')
    openPopup(popup, body)

    delete_popup_cancel.onclick = async () => {
        const popup = document.getElementById('delete_popup')
        cancelPopup(popup, body)
    }

    popup_delete_account.onclick = async () => {
        const carID = element.getAttribute('car_id')
        const response = await fetch(
            `${host}/transport/remove/${carID}/${localStorage.getItem('token')}`,
            {
                method: 'POST',
                headers: headers,
            }
        )
        const result = await response.json()
        if (result.isError) {
            showErrorBanner(result.message)
        }
        else {
            element.parentNode.parentNode.remove()
            showSuccessBanner('Транспорт удален')
        }
        cancelPopup(popup, body)
    }
}