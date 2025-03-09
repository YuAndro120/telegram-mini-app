document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
    }

    document.addEventListener("DOMContentLoaded", () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
            tg.themeParams.bg_color = ""; // Отключаем смену цвета
            document.body.style.background = 'url(/images/background.jpg) no-repeat center center fixed';
            document.body.style.backgroundSize = "cover";
        }
    });
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElem = document.getElementById("cart-count");

    function updateCartCount() {
        if (cartCountElem) {
            cartCountElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    if (document.querySelector(".add-to-cart")) {
        // Логика для главной страницы (добавление в корзину)
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", () => {
                const name = button.dataset.name;
                const existingItem = cart.find(item => item.name === name);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ name, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
            });
        });

        const cartBtn = document.getElementById("cart-btn");
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                window.location.href = "cart.html";
            });
        }

        updateCartCount();
    }

    if (document.getElementById("cart-items")) {
        // Логика для страницы корзины
        const cartItemsContainer = document.getElementById("cart-items");
        const checkoutBtn = document.getElementById("checkout");

        function renderCart() {
            cartItemsContainer.innerHTML = "";
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
                checkoutBtn.disabled = true; // Блокируем кнопку заказа
                return;
            }
            
            checkoutBtn.disabled = false; // Разблокируем кнопку заказа

            cart.forEach((item, index) => {
                const itemElem = document.createElement("div");
                itemElem.classList.add("cart-item");
                itemElem.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <button class="increase" data-index="${index}">+</button>
                    <button class="decrease" data-index="${index}">-</button>
                    <button class="remove" data-index="${index}">Удалить</button>
                `;
                cartItemsContainer.appendChild(itemElem);
            });

            // Обработчики кнопок
            document.querySelectorAll(".increase").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    cart[e.target.dataset.index].quantity++;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                });
            });

            document.querySelectorAll(".decrease").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const index = e.target.dataset.index;
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                });
            });

            document.querySelectorAll(".remove").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    cart.splice(e.target.dataset.index, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                });
            });
        }

        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return; // Защита от пустого заказа

            const payment = document.getElementById("payment-method").value;
            const delivery = document.getElementById("delivery-method").value;
            alert(`Заказ оформлен!\nОплата: ${payment}\nДоставка: ${delivery}`);
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        });

        renderCart();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTfJN6rZ1WC25-olNh4o1g7Ar7ZzYJofDBQkxbmbyxIqaxpdhhI617u5p-azfZPUjDEQ37IfXpRo4M/pub?output=csv"

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").map(row => row.split(","));
            rows.shift(); // Удаляем заголовки

            const container = document.getElementById("products-container");
            rows.forEach(row => {
                const [name, price, image] = row;
                const productElem = document.createElement("div");
                productElem.classList.add("product");
                productElem.innerHTML = `
                    <img src="${image}" alt="${name}" class="product-img">
                    <h3>${name}</h3>
                    <p>${price} ₽</p>
                    <button class="add-to-cart" data-name="${name}" data-price="${price}">
                        Добавить в корзину
                    </button>
                `;
                container.appendChild(productElem);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
});
