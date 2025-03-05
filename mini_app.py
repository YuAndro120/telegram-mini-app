from telethon import TelegramClient, events
from telethon.tl.custom import Button

# Данные API
api_id = 27395391  # Твой API ID
api_hash = '7210e366e008df4aa5bbe7a99ce751a0'  # Твой API Hash
phone_number = '+79083181202'  # Твой номер

# Ссылка на Mini App (GitHub Pages)
MINI_APP_URL = 'https://YuAndro120.github.io/telegram-mini-app/'

# Инициализация клиента
client = TelegramClient('session_name', api_id, api_hash)

@client.on(events.NewMessage(pattern='/start'))
async def start(event):
    button = Button.url("Открыть Mini App", MINI_APP_URL)
    await event.respond('Привет! Нажми на кнопку ниже, чтобы открыть Mini App:', buttons=[[button]])

async def main():
    await client.start(phone_number)
    print("Бот запущен!")
    await client.run_until_disconnected()

client.loop.run_until_complete(main())