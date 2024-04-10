if (window.location.pathname.endsWith("confirmation.html")) {
    const urlSearch = new URLSearchParams(window.location.search)
    const orderId = urlSearch.get("orderId")
    document.getElementById("orderId").textContent = orderId
} else {
    // The values of "user_choice" in the Local Storage
    let productLocalStorage = JSON.parse(localStorage.getItem("product"))

    // If the cart is empty
    if (productLocalStorage == null || productLocalStorage.length == []) {
        const cart__items = document.getElementById("cart__items")
        let cartEmpty = `<h2>Le panier est vide</h2>`
        cart__items.innerHTML = cartEmpty
    }
    // If there is a product in the cart
    else {
        // Display the table information with a loop
        for (let i = 0; i < productLocalStorage.length; i++) {
            // Select the id "cart__items", create and add
            const cart__items = document.getElementById("cart__items")
            let cart = `
                <article class="cart__item">
                    <div class="cart__item__img">
                        <img src="${productLocalStorage[i].image}" alt="${productLocalStorage[i].altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${productLocalStorage[i].product}</h2>
                            <p>${productLocalStorage[i].color}</p>
                            <p>${productLocalStorage[i].price * productLocalStorage[i].quantity}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLocalStorage[i].quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Delete</p>
                            </div>
                        </div>
                    </div>
                </article>`
            cart__items.innerHTML += cart

            const deleteItem = document.querySelectorAll(".deleteItem")
            for (let d = 0; d < deleteItem.length; d++) {
                deleteItem[d].addEventListener("click", event => {
                    event.preventDefault()
                    // Delete the product selected and updated the informations
                    productLocalStorage = productLocalStorage.filter(el => !(el.id == productLocalStorage[d].id && el.color == productLocalStorage[d].color))
                    localStorage.setItem("product", JSON.stringify(productLocalStorage))
                    window.location.reload()
                })
            }

            // Show the number of products
            let allQuantity = []
            for (let j = 0; j < productLocalStorage.length; j++) {
                let quantity = productLocalStorage[j].quantity
                let addQuantity = parseInt(quantity, 10)
                allQuantity.push(addQuantity)
            }
            let quantityReduce = allQuantity.reduce((previousValue, currentValue) => previousValue + currentValue)
            const totalQuantity = document.getElementById("totalQuantity")
            totalQuantity.innerHTML = quantityReduce

            // Show total price
            let allPrice = []
            for (let j = 0; j < productLocalStorage.length; j++) {
                let addPrice = productLocalStorage[j].price * productLocalStorage[j].quantity
                allPrice.push(addPrice)
            }
            let priceReduce = allPrice.reduce((previousValue, currentValue) => previousValue + currentValue)
            const totalPrice = document.getElementById("totalPrice")
            totalPrice.innerHTML = priceReduce

            // Add or remove the number of a product            
            const itemQuantity = document.querySelectorAll(".itemQuantity")
            for (let u = 0; u < itemQuantity.length; u++) {
                itemQuantity[u].addEventListener("change", event => {
                    let udapteQuantity = event.target
                    let quantity = udapteQuantity.value
                    if (quantity < 1 || quantity > 100) {
                        alert("un nombre 1 entre 100")
                    } else {
                        productLocalStorage[u].quantity = quantity
                        localStorage.setItem("product", JSON.stringify(productLocalStorage))
                        window.location.reload()
                    }
                })
            }
        }
        // Form
        const order = document.querySelector("#order")
        order.addEventListener("click", event => {
            event.preventDefault()
            const firstName = document.getElementById("firstName").value.trim()
            const lastName = document.getElementById("lastName").value.trim()
            const address = document.getElementById("address").value.trim()
            const city = document.getElementById("city").value.trim()
            const email = document.getElementById("email").value.trim()

            if (checkFisrtName() && checkLastname() && checkAddress() && checkCity() && checkEmail()) {
                let contact = {
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    email: email
                }
                let products = []
                for (let i = 0; i < productLocalStorage.length; i++) {
                    products.push(productLocalStorage[i].id)
                }
                fetch("https://ndeby-veronique-chimene-5-back.onrender.com/api/products/order", {
                        method: "POST",
                        body: JSON.stringify({contact,products}),
                        headers: {
                            "Content-Type": "application/json",
                            'Accept': 'application/json'
                        }
                    })
                    .then(resp => {
                        if (resp.ok) {
                            return resp.json()
                        }
                    })
                    .then(command => {
                        window.location = "./confirmation.html?orderId=" + command.orderId
                        localStorage.clear("product", JSON.stringify(productLocalStorage))
                    })
            }

            function msgError(selectID, msg) {
                document.getElementById(`${selectID}`).textContent = msg
            }

            function checkFisrtName() {
                if ((/^[A-Za-z][A-Za-z '-]{2,}$/).test(firstName)) {
                    msgError('firstNameErrorMsg', "")
                    return true
                } else {
                    msgError('firstNameErrorMsg', "Prénom incorrect, veuillez écrire un prénom valide")
                    return false
                }
            }

            function checkLastname() {
                if ((/^[A-Za-z][A-Za-z '-]{2,}$/).test(lastName)) {
                    msgError('lastNameErrorMsg', "")
                    return true
                } else {
                    msgError('lastNameErrorMsg', "Nom incorrect, veuillez écrire un nom valide")
                    return false
                }
            }

            function checkAddress() {
                if ((/^[\w][\w '-]+$/).test(address)) {
                    msgError('addressErrorMsg', "")
                    return true
                } else {
                    msgError('addressErrorMsg', "Veuillez écrire une adresse valide")
                    return false
                }
            }

            function checkCity() {
                if ((/^[A-Za-z][A-Za-z '-]+$/).test(city)) {
                    msgError('cityErrorMsg', "")
                    return true
                } else {
                    msgError('cityErrorMsg', "Veuillez écrire une ville")
                    return false
                }
            }

            function checkEmail() {
                if ((/^[\w\.-]+@[\w\.-]+\.[\w]+$/).test(email)) {
                    msgError('emailErrorMsg', "")
                    return true
                } else {
                    msgError('emailErrorMsg', "Veuillez écrire un email valide")
                    return false
                }
            }
        })
    }
}