import { Telegraf, Markup } from 'telegraf';
import harryPotterSpells from 'harry-potter-spells'
import harryPotterNames from 'harry-potter-names'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'


dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN);

// parse application/x-www-form-urlencoded
bodyParser.urlencoded({ extended: false })

// parse application/json
bodyParser.json()

//Start
bot.start((ctx) => {
  ctx.reply(`Welcome ${ctx.message.from.first_name}  ! 
  use /help`)
})

//Help
bot.help((ctx) => {
  ctx.reply(`Hello 
  ➖ /calc : A calculator
  ➖ /id : Get your full information 
  ➖ /game : Play a game
  `)
  

})

//Get user information
bot.command("id", (ctx) => {
  const userInformation = ctx.from
  bot.telegram.getUserProfilePhotos(ctx.from.id, { limit: 1 })
    .then(photos => {
      const photo = photos.photos[0][0];
      ctx.replyWithMediaGroup([
        {
          type: 'photo',
          media: photo.file_id,
          caption: `
          Message 
        ├ from
        ┊   ├ id: ${userInformation.id}
        ┊   ├ first_name: ${userInformation.first_name}
        ┊   ├ username: @${userInformation.username}
        └ `
        }
      ])

    })

})


//[CMD] Harry potter game with bot
bot.command("game", (ctx) => {
  const botSpell = harryPotterSpells.random()
  const botName = harryPotterNames.random()
  const playerSpell = harryPotterSpells.random()
  const playerName = harryPotterNames.random()

  let duelResult;
  let random = Math.floor(Math.random() * 2)
  if (random == 0) {
    duelResult = `Bot wins.`
  }
  else {
    duelResult = `${ctx.from.first_name} Wins.`
  }

  ctx.reply(`
  🧙‍♂️ Im(Bot) ${botName}.
  🪄 ${botSpell.name} 
  💥 Spell effect: ${botSpell.effect} 
  _________________________________
  
  🧙‍♂️ ${ctx.from.first_name} are: ${playerName}
  🪄 ${playerSpell.name} 
  💥 Spell effect: ${playerSpell.effect}
  
  ➖➖➖➖➖➖➖➖➖➖➖➖➖➖
   ${duelResult}`)

})



//#region [CMD] Calculator
let buttonPanel = [
  [{ text: "1", callback_data: "btn-1" }, { text: "2", callback_data: "btn-2" }, { text: "3", callback_data: "btn-3" }],
  [{ text: "4", callback_data: "btn-4" }, { text: "5", callback_data: "btn-5" }, { text: "6", callback_data: "btn-6" }],
  [{ text: "7", callback_data: "btn-7" }, { text: "8", callback_data: "btn-8" }, { text: "9", callback_data: "btn-9" }],
  [{ text: "0", callback_data: "btn-0" }],
  [{ text: "+", callback_data: "btn-+" }, { text: "-", callback_data: "btn--" }, { text: "*", callback_data: "btn-*" }, { text: "/", callback_data: "btn-/" }],
  [{ text: "=", callback_data: "btn-=" }]
]

let calculatorState = {};

bot.command("calc", ctx => {
  calculatorState[ctx.from.id] = {
    messageId: null,
    equation: ''
  };
  ctx.reply(`Hi ${ctx.from.first_name}, Please use the buttons`,
    Markup.inlineKeyboard(buttonPanel))
    .then(message => {
      calculatorState[ctx.from.id].messageId = message.message_id;
    })
})

//Button handler function
function actionButton(action, ctx) {
  try {
    calculatorState[ctx.from.id].equation += action;

    ctx.telegram.editMessageText(ctx.chat.id, calculatorState[ctx.from.id].messageId, undefined, ` ${calculatorState[ctx.from.id].equation}`, { reply_markup: { inline_keyboard: buttonPanel } })
  }
  catch {

  }

}

let sum = ""
//#region Button Actions
bot.action("btn-1", (ctx) => {
  actionButton("1", ctx)
})
bot.action("btn-2", (ctx) => {
  actionButton("2", ctx)
})
bot.action("btn-3", (ctx) => {
  actionButton("3", ctx)
})
bot.action("btn-4", (ctx) => {
  actionButton("4", ctx)

})
bot.action("btn-5", (ctx) => {
  actionButton("5", ctx)

})
bot.action("btn-6", (ctx) => {

  actionButton("6", ctx)

})
bot.action("btn-7", (ctx) => {
  actionButton("7", ctx)

})
bot.action("btn-8", (ctx) => {
  actionButton("8", ctx)

})
bot.action("btn-9", (ctx) => {
  actionButton("9", ctx)

})
bot.action("btn-0", (ctx) => {
  actionButton("0", ctx)

})
bot.action("btn--", (ctx) => {
  actionButton("-", ctx)

})
bot.action("btn-+", (ctx) => {
  actionButton("+", ctx)

})
bot.action("btn-*", (ctx) => {
  actionButton("*", ctx)

})
bot.action("btn-/", (ctx) => {
  actionButton("/", ctx)

})
bot.action("btn-=", (ctx) => {
  try {
    if (calculatorState[ctx.from.id].equation == "" || calculatorState[ctx.from.id].equation == null || calculatorState[ctx.from.id].equation == undefined) {
      ctx.editMessageText(`Enter something!`)
      ctx.editMessageReplyMarkup({
        inline_keyboard: buttonPanel
      })
      return;
    }
    sum = eval(calculatorState[ctx.from.id].equation)
    parseInt(sum)
    ctx.editMessageText(`Answer : ${sum}`)
    ctx.editMessageReplyMarkup({
      inline_keyboard: buttonPanel
    })
    calculatorState[ctx.from.id].equation = ""
  }
  catch {
    ctx.reply("Sorry, Equation isn't make sense => /calc")
  }


})
//#endregion

//#endregion 



bot.launch()