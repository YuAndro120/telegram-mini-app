document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    tg.expand(); // Разворачиваем WebApp на весь экран

    // Получаем данные пользователя
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById("user-name").textContent = user.first_name;
        document.getElementById("user-id").textContent = user.id;
        document.getElementById("user-photo").src = user.photo_url || "default-avatar.png";
    }

    // Закрытие мини-приложения
    document.getElementById("close-btn").addEventListener("click", () => {
        tg.close();
    });

    // Корзина
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBtn = document.getElementById("cart-btn");
    const cartCountElem = document.getElementById("cart-count");

    function updateCartCount() {
        cartCountElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

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

    updateCartCount();

    cartBtn.addEventListener("click", () => {
        window.location.href = "cart.html"; // Открываем страницу корзины
    });
});
