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
