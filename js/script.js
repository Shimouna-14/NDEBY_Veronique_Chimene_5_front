// The link for the API informations in JSON
fetch("https://ndeby-veronique-chimene-5-back.onrender.com")
    .then(resp => {if (resp.ok) {return resp.json()}})
    
    // Display the table information with a loop
    .then(products =>{
        for (let i = 0; i < products.length; i++){
            // Select the element of the HTML file 
            const item = document.querySelector(".items")
            let allProducts = `
            <a href="./product.html?id=${products[i]._id}">
                <article>
                    <img src="${products[i].imageUrl}" alt=${products[i].altTxt}>
                    <h3 class="productName">${products[i].name}</h3>
                    <p class="productDescription">${products[i].description}</p>
                </article>
            </a>
            `
            item.innerHTML += allProducts
        }
    })
