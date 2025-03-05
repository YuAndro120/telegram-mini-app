document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    tg.expand();  // Разворачиваем WebApp на весь экран

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
});

document.addEventListener("DOMContentLoaded", function() {
    let cartCount = 0;
    const cartBtn = document.getElementById("cart-btn");
    const cartCountElem = document.getElementById("cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            cartCount++;
            cartCountElem.textContent = cartCount;
        });
    });

    cartBtn.addEventListener("click", function() {
        alert(`Товаров в корзине: ${cartCount}`);
    });
});