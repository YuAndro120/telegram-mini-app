document.addEventListener("DOMContentLoaded", () => {
    // Инициализация Telegram WebApp
    const initTelegram = () => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
            tg.themeParams.bg_color = "";
            document.body.style.background = 'url(/images/background.jpg) no-repeat center center fixed';
            document.body.style.backgroundSize = "cover";
        }
    };

    // Работа с корзиной
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElem = document.getElementById("cart-count");

    const updateCartCount = () => {
        if (cartCountElem) {
            cartCountElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    };

    // Загрузка товаров из Google Sheets
    const loadProducts = () => {
        const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTfJN6rZ1WC25-olNh4o1g7Ar7ZzYJofDBQkxbmbyxIqaxpdhhI617u5p-azfZPUjDEQ37IfXpRo4M/pub?output=csv";
        
        fetch(sheetUrl)
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.split("\n")
                    .map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                    .map(cell => cell.trim().replace(/^"|"$/g, '')));

                rows.shift(); // Удаляем заголовок
                const container = document.getElementById("products-container");
                
                if (container) {
                    container.innerHTML = '';
                    rows.forEach(row => {
                        const [name, price, image] = row;
                        if (!name || !price || !image) return;

                        const productHTML = `
                            <div class="product">
                                <img src="${image}" alt="${name}" class="product-img">
                                <h3>${name}</h3>
                                <p>${price} ₽</p>
                                <button class="add-to-cart" data-name="${name}" data-price="${price}">
                                    Добавить в корзину
                                </button>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', productHTML);
                    });

                    // Обработчик добавления в корзину
                    container.addEventListener('click', (e) => {
                        if (e.target.classList.contains('add-to-cart')) {
                            const button = e.target;
                            const item = {
                                name: button.dataset.name,
                                price: button.dataset.price,
                                quantity: 1
                            };

                            const existing = cart.find(i => i.name === item.name);
                            existing ? existing.quantity++ : cart.push(item);
                            
                            localStorage.setItem("cart", JSON.stringify(cart));
                            updateCartCount();
                        }
                    });
                }
            })
            .catch(error => console.error("Error loading products:", error));
    };

    // Логика страницы корзины
    const initCartPage = () => {
        const cartItemsContainer = document.getElementById("cart-items");
        const checkoutBtn = document.getElementById("checkout");

        if (cartItemsContainer) {
            const renderCart = () => {
                cartItemsContainer.innerHTML = '';
                
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
                    if (checkoutBtn) checkoutBtn.disabled = true;
                    return;
                }

                if (checkoutBtn) checkoutBtn.disabled = false;
                
                cart.forEach((item, index) => {
                    const itemHTML = `
                        <div class="cart-item">
                            <span>${item.name} (x${item.quantity}) - ${item.price * item.quantity} ₽</span>
                            <div class="cart-controls">
                                <button class="increase" data-index="${index}">+</button>
                                <button class="decrease" data-index="${index}">-</button>
                                <button class="remove" data-index="${index}">×</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
                });

                // Обработчики управления количеством
                const handleCartAction = (e) => {
                    const index = parseInt(e.target.dataset.index);
                    
                    if (e.target.classList.contains('increase')) {
                        cart[index].quantity++;
                    } else if (e.target.classList.contains('decrease')) {
                        cart[index].quantity > 1 ? cart[index].quantity-- : cart.splice(index, 1);
                    } else if (e.target.classList.contains('remove')) {
                        cart.splice(index, 1);
                    }
                    
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                };

                cartItemsContainer.addEventListener('click', handleCartAction);
            };

            // Оформление заказа
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    const payment = document.getElementById("payment-method")?.value || "Не указано";
                    const delivery = document.getElementById("delivery-method")?.value || "Не указано";
                    
                    alert(`Заказ оформлен!\nСумма: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ₽\nОплата: ${payment}\nДоставка: ${delivery}`);
                    
                    localStorage.removeItem("cart");
                    cart = [];
                    updateCartCount();
                    window.location.href = "index.html";
                });
            }

            renderCart();
        }
    };

    // Инициализация
    initTelegram();
    loadProducts();
    updateCartCount();
    initCartPage();

    // Переход в корзину
    const cartBtn = document.getElementById("cart-btn");
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = "cart.html";
        });
    }
});