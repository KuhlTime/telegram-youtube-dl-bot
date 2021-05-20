const https = require('https')
const TelegramBot = require('node-telegram-bot-api')
const youtubedl = require('youtube-dl-exec')
const env = require('./config/env')

require('./config/sentry')

const bot = new TelegramBot(env.telegramBotToken, { polling: true })

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Send me a URL and I will try to download your video!')
})

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

function downloadFromFormats(chatId, formats) {
  const filteredFormats = formats.filter((f) => f.ext === 'mp4' && f.filesize)
  const sortedFormats = filteredFormats.sort((a, b) => {
    return a.width > b.width ? -1 : 1
  })
  const bestFormat = sortedFormats[0]
  const url = bestFormat.url

  let responseMarkdown = ''

  for (const f of sortedFormats) {
    const note = f.format_note
    const link = `• [${note} - ${f.ext}](${url})\n`
    responseMarkdown += link
  }

  bot.sendMessage(chatId, responseMarkdown, { parse_mode: 'Markdown' })

  // Videos are limited to 50MB

  // https.get(url, (res) => {
  //   bot.sendMessage(chatId, 'Downloading Video...')
  //   bot.sendVideo(chatId, res)
  // })
}

bot.on('text', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  console.log(text)

  if (text.match(urlRegex) && text && text !== '' && text) {
    const output = await youtubedl(text, {
      dumpSingleJson: true
    })

    const entries = output.entries

    if (entries) {
      entries.forEach((e) => {
        downloadFromFormats(chatId, e.formats)
      })
    } else if (output.formats) {
      downloadFromFormats(chatId, output.formats)
    } else {
      bot.sendMessage(chatId, `Could not find any video on that Page.`)
    }

    // bot.sendMessage(chatId, output)
  } else if (text === '/start') {
    return
  } else {
    bot.sendMessage(chatId, `Invalid URL`)
  }
})
