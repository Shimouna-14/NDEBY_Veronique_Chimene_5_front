// Get the id on the URL of the page, retrieve it and put its data
const urlSearch = new URLSearchParams(window.location.search)
const id = urlSearch.get("id")
fetch("https://ndeby-veronique-chimene-5-back.onrender.com/api/products/" + id)
    .then(resp => { if (resp.ok) {return resp.json()} })

    .then(productSelect => {
        // // Add the image of the product in ".item__img"
        const item_img = document.querySelector(".item__img");
        const img = `<img src="${productSelect.imageUrl}" alt="${productSelect.altTxt}">`
        item_img.innerHTML = img

        // Add the name in "#title" et "title"
        const title = document.getElementById("title")
        const titlePage = document.querySelector("title")
        const name = `<h1 id="title">${productSelect.name}</h1>`
        title.innerHTML = name
        titlePage.innerHTML = productSelect.name

        // Add the price in "#price"
        const cost = document.getElementById("price")
        const price = `<span id="price">${productSelect.price}</span>`
        cost.innerHTML = price

        // Add the description in "#description"
        const descript = document.getElementById("description")
        const description = `<p id="description">${productSelect.description}</p>`
        descript.innerHTML = description

        // Put the elements of the table "colors" by their size
        const colors = document.getElementById("colors")
        const selectColor = productSelect.colors
        for (let i = 0; i < selectColor.length; i++) {
            const option = document.createElement("option")
            colors.appendChild(option)
            colors.add = (option)
            option.value = [i]
            option.text = selectColor[i]
        }

        // Select the data and put it in the Local Storage
        const quantity = document.getElementById("quantity")
        const button = document.getElementById("addToCart")
        button.addEventListener("click", event => {
            event.preventDefault()
            let user_choice = {
                image: productSelect.imageUrl,
                altTxt: productSelect.altTxt,
                product: productSelect.name,
                id: productSelect._id,
                color: colors.options[colors.selectedIndex].text,
                quantity: quantity.value,
                price: productSelect.price
            }

            if (quantity.value < 1 || quantity.value > 100 || colors.value === ""){
                alert("Choisissez une couleur et un nombre entre 1 & 100")            
            } else {
                // Put the data of "user_choice" in the Local Storage
                let productLocalStorage = JSON.parse(localStorage.getItem("product"))
                if (productLocalStorage) {
                    let found = false;
                    for (let current of productLocalStorage) {
                        // If the product is already in the Local, add the quantity added
                        if (current.id == user_choice.id && current.color == user_choice.color) {
                            found = true
                            let storage_quantity = parseInt(current.quantity, 10)
                            let user_quantity = parseInt(user_choice.quantity, 10)
                            current.quantity = storage_quantity += user_quantity
                            localStorage.setItem("product", JSON.stringify(productLocalStorage))
                            alert("L'article a été ajouté au panier")
                        }
                    }
                    // If the condition is false, a new product is added in the Local Storage
                    if (!found) {
                        productLocalStorage.push(user_choice)
                        localStorage.setItem("product", JSON.stringify(productLocalStorage))
                    }
                // if the Local Storage is empty, a array is create
                } else {
                    productLocalStorage = []
                    productLocalStorage.push(user_choice)
                    localStorage.setItem("product", JSON.stringify(productLocalStorage))
                }
            }
        })
    })