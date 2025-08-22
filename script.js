const products = [
    { name: "Протеин Whey", price: 50, category: "Протеины", img: "images/protein.jpg" },
    { name: "Креатин", price: 30, category: "Добавки", img: "images/creatine.jpg" },
    { name: "Витамины", price: 20, category: "Витамины", img: "images/vitamins.jpg" },
    { name: "BCAA", price: 25, category: "Добавки", img: "images/bcaa.jpg" },
    { name: "Энергетический гель", price: 15, category: "Энергия", img: "images/energy.jpg" }
];

let cartCount = 0;
const cartItems = [];
const cartDisplay = document.getElementById("cart-count");
const cartList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");
const container = document.getElementById("products-container");

// Загружаем корзину из localStorage
const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const savedCartCount = parseInt(localStorage.getItem("cartCount")) || 0;
if(savedCartItems.length > 0){
    savedCartItems.forEach(item => cartItems.push(item));
    cartCount = savedCartCount;
    cartDisplay.innerText = cartCount;
    updateCart();
}

// Функции корзины
function addToCart(product){
    cartItems.push(product);
    cartCount++;
    cartDisplay.innerText = cartCount;
    updateCart();
}

function updateCart(){
    cartList.innerHTML = "";
    let total = 0;
    cartItems.forEach((item, index)=>{
        total += item.price;
        const li = document.createElement("li");
        li.innerText = `${item.name} - ${item.price}€`;

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Удалить";
        removeBtn.addEventListener("click", ()=>{
            cartItems.splice(index, 1);
            cartCount--;
            cartDisplay.innerText = cartCount;
            updateCart();
        });

        li.appendChild(removeBtn);
        cartList.appendChild(li);
    });
    cartTotalDisplay.innerText = total;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartCount", cartCount);
}

// Отображение товаров
function displayProducts(filteredProducts){
    container.innerHTML = "";
    filteredProducts.forEach(product=>{
        const div = document.createElement("div");
        div.className = "product";

        const img = document.createElement("img");
        img.src = product.img;
        img.alt = product.name;

        const h2 = document.createElement("h2");
        h2.innerText = product.name;

        const p = document.createElement("p");
        p.innerText = `Цена: ${product.price}€`;

        const btn = document.createElement("button");
        btn.innerText = "Купить";
        btn.addEventListener("click", ()=> addToCart(product));

        div.appendChild(img);
        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(btn);

        container.appendChild(div);
    });
}

// Фильтры
document.querySelectorAll("#filters button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const category = btn.getAttribute("data-category");
        if(category === "Все") displayProducts(products);
        else displayProducts(products.filter(p => p.category === category));
    });
});

// Отображаем все товары
displayProducts(products);

// Оформление заказа
document.getElementById("place-order").addEventListener("click", ()=>{
    if(cartItems.length === 0){
        alert("Корзина пуста!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if(!name || !email || !address){
        alert("Пожалуйста, заполните все поля формы.");
        return;
    }

    let summary = `Заказ от: ${name}
Email: ${email}
Адрес: ${address}

Вы заказали:
`;

    cartItems.forEach(item=>{
        summary += `- ${item.name} (${item.price}€)\n`;
    });

    summary += `Общая сумма: ${cartTotalDisplay.innerText}€`;

    alert(summary);

    // Очистка корзины и формы
    cartItems.length = 0;
    cartCount = 0;
    updateCart();

    document.getElementById("customer-name").value = "";
    document.getElementById("customer-email").value = "";
    document.getElementById("customer-address").value = "";
});
