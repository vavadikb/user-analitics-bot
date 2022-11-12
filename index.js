const { Telegraf } = require('telegraf');

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('Welcome')
    
});
bot.hears('hi', (ctx) => {
    ctx.reply('Hey there')
    console.log(getChatMembers(ctx.chat.id))
})

// console.log(bot)
bot.launch()