const { Telegraf } = require('telegraf');
const cron = require('node-cron');

const users = ['Miksam_13', 'vad22', 'ju_dio', 'quartz555', 'Llairet'];

require('dotenv').config()

const { BOT_TOKEN, CHAT_ID } = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Hello!'));

const usersMessage = [];

function messageCounterByUser(users) {
    let resultActive = {};
    let message = '';

    users.forEach((a) => {
        if (resultActive[a] !== undefined) {
            ++resultActive[a];
        }
        else {
            resultActive[a] = 1;
        }
    });

    resultActive = Object.entries(resultActive)
      .sort(([,a],[,b]) => b-a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    for (const key in resultActive) {
        message += `${key} - ${resultActive[key]} сообщения(е)\n`;
    }
    return message;
}

function messageByNotActiveUser(usersAll) {
    const usersNotActive = usersAll.filter(el => !usersMessage.includes(el));
    let resultNotActive = {};
    let message = '';

    usersNotActive.forEach((a) => {
        ++resultNotActive[a];
    });

    for (const key in resultNotActive) {
        message += `${key}, `;
    }
    return message + 'были не активными, ребята, давайте активничайте';
}

function messageAllActiveUser(usersAll) {
    const usersNotActive = usersAll.filter(el => !usersMessage.includes(el));
    let resultNotActiveAll = {};
    let resultActiveAll = {};
    let message = '';

    usersNotActive.forEach((a) => {
        resultNotActiveAll[a] = 0;
    });

    users.forEach((a) => {
        if (resultActiveAll[a] !== undefined) {
            ++resultActiveAll[a];
        } else {
            resultActiveAll[a] = 1;
        }
    });

    let result = { ...resultActiveAll, ...resultNotActiveAll };

    result = Object.entries(result)
      .sort(([,a],[,b]) => b-a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    for (const key in result) {
        message += `${key} - ${result[key]} сообщения(е)\n`;
    }
    return message;
}

bot.hears('/getstat', (ctx) => {
    ctx.reply(messageCounterByUser(usersMessage));
});

bot.hears('/getnotactive', (ctx) => {
    ctx.reply(messageByNotActiveUser(users));
});

bot.hears('/getallactive', (ctx) => {
    ctx.reply(messageAllActiveUser(users));
});

bot.on('message',  (ctx) => {
    usersMessage.push(ctx.message.from.username);
});

cron.schedule('* 9 * * 1', () => {
    bot.telegram.sendMessage(CHAT_ID, messageCounterByUser(usersMessage))
});

bot.launch();
