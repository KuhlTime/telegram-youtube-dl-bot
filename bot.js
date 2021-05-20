const TelegramBot = require('node-telegram-bot-api')
const env = require('./config/env')

require('./config/sentry')

const bot = new TelegramBot(env.telegramBotToken, { polling: true })

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'This is a demo bot created from: https://github.com/KuhlTime/node-telegram-boilerplate')
})

bot.on('text', (msg) => {
  const chatId = msg.chat.id

  if (msg.text != '/start') {
    bot.sendMessage(chatId, `Recieved: ${msg.text}`)
  }
})
