let object = []

let categoriesBlock = ''

let productsBlock = ''

let categoriesBtns = []

let modalWindow = ''
        
const shopID = '1' // ID магазина на TradeMC

// Первоначальная прогрузка товаров и категорий на сайте

document.addEventListener('DOMContentLoaded', () => {

    const query = `https://api.trademc.org/shop.getItems?shop=${shopID}&v=3`

    fetch(query)
        .then(response => response.json())
        .then(data => {object = data.response.categories; loadDocument()})
        .catch(error => console.error(error))

})

function loadDocument() {
    categoriesBlock = document.getElementById('categories-block')

    productsBlock = document.getElementById('products-block')

    modalWindow = document.getElementById('modal-window')

    categoriesBlock.innerHTML += `<div class="category category_active" category="all" onclick="selectCategory()">Все товары</div>`
    let products = ""
    for (let i in object) {
        categoriesBlock.innerHTML += `<div class="category" category="${object[i].id}" onclick="selectCategory(${object[i].id})">${object[i].name}</div>`
        for (let n in object[i].items) {
            products += `<div class="product__card">
                            <h1 class="product__title">${object[i].items[n].name}</h1>
                            <img src="${object[i].items[n].image}" alt="image-${object[i].items[n].id}"/>
                            <div class="cost__buy">
                                <p class="prosuct__cost">${cost(object[i].items[n])}</p>
                                <button class="product__buy_button" onclick="openModalWindow(${object[i].items[n].id})">Купить</button>
                            </div>
                        </div>`
            }
    }
    productsBlock.innerHTML = products
    categoriesBtns = document.getElementsByClassName('category')
}

const cost = (obj) => {
    if (obj.type === 2) {
        return `${obj.game_currency_rate} за ${obj.cost}Р`
    } else {
        return `${obj.cost}Р`
    }
}

// Функция выбора категорий

function selectCategory(id = "all") {
    for (let i = 0; i < categoriesBtns.length; i++) {
        let category = categoriesBtns[i].getAttribute('category')
        let classes = categoriesBtns[i].getAttribute('class')
        if (classes === "category category_active") {
            categoriesBtns[i].setAttribute('class', 'category')
        }
        if (category === String(id)) {
            categoriesBtns[i].setAttribute('class', 'category category_active')
        }
    }

    let products = ""

    if (id === "all") {
        for (let i in object) {
            for (let n in object[i].items) {
                products += `<div class="product__card">
                                <h1 class="product__title">${object[i].items[n].name}</h1>
                                <img src="${object[i].items[n].image}" alt="image-${object[i].items[n].id}"/>
                                <div class="cost__buy">
                                    <p class="prosuct__cost">${ cost(object[i].items[n]) }</p>
                                    <button class="product__buy_button" onclick="openModalWindow(${object[i].items[n],id})">Купить</button>
                                </div>
                            </div>`
            }
        }
    } else {
        for (let i in object) {
            if (object[i].id === id) {
                for (let n in object[i].items) {
                    const cost = () => {
                        if (object[i].items[n].type === 2) {
                            return `${object[i].items[n].cost}`
                        } else {
                            return `${object[i].items[n].cost}Р`
                        }
                    }
                    products += `<div class="product__card">
                                    <h1 class="product__title">${object[i].items[n].name}</h1>
                                    <img src="${object[i].items[n].image}" alt="image-${object[i].items[n].id}"/>
                                    <div class="cost__buy">
                                        <p class="prosuct__cost">${ cost(object[i].items[n]) }</p>
                                        <button class="product__buy_button" onclick="openModalWindow(${object[i].items[n].id})">Купить</button>
                                    </div>
                                </div>`
                }
            }
        }
    }
    productsBlock.innerHTML = products

}

// Работа с модальным окном

function closeModalWindow() {
    modalWindow.setAttribute('class', 'modal__window')
}

document.addEventListener('click', (e) => {
    if(e.target === modalWindow) {
        closeModalWindow()
    }
})

function buyItem(e, id = 0, count = 1) {
    e.preventDefault()

    let name = document.getElementById('name')
    let mail = document.getElementById('mail')
    name.style = ""
    mail.style = ""
    if (mail.value == "" || name.value == "") {
        if (mail.value == "") {
            mail.style = "box-shadow: inset 0 0 1px 1px rgba(255, 73, 73, 1)"
        } if (name.value == "") {
            name.style = "box-shadow: inset 0 0 1px 1px rgba(255, 73, 73, 1)"
        }
        return
    }

    fetch(`https://api.trademc.org/shop.buyItems?buyer=${name.value}&items=${id}&v=3`)
        .then(response => response.json())
        .then(data => {
            console.log(data.response.cart_id)
            window.location.href = `https://pay.trademc.org/?cart_id=${data.response.cart_id}&success_url=${window.location}&pending_url=${window.location}&fail_url=${window.location}`
        })
        .catch(error => console.log(error))
}
        
function openModalWindow(id = 0) {
    for (let i in object) {
        for (let n in object[i].items)
            if (object[i].items[n].id === id) {
                console.log(object[i].items[n])
                modalWindow.setAttribute('class', 'modal__window modal__visible')
                modalWindow.innerHTML = `<div class="modal__element">
                                            <div class="modal__content">
                                                <div class="text">
                                                    <h1>${object[i].items[n].name}</h1>
                                                    <p>${object[i].items[n].description}</p>
                                                </div>
                                                <form action="">
                                                    <input type="text" placeholder="Никнейм" id="name">
                                                    <input type="text" placeholder="Почта" id="mail">
                                                    <button onclick="buyItem(event, ${object[i].items[n].id})">Перейти к оплате</button>
                                                </form>
                                            </div>
                                            <div class="modal__image">
                                                <img src="${object[i].items[n].image}" alt="image">
                                            </div>
                                        </div>`
                break
            }
    }
}