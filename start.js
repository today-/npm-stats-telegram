require('dotenv').config();
const path = require('path');
const axios = require('axios');
const Telegraf = require('telegraf');
const fastifyApp = require('fastify')({ trustProxy: true });
const SocksAgent = require('socks5-https-client/lib/Agent');
const getLocalImage = require('./src/get-local-image');
const getNames = require('./src/get-names');
const getStats = require('./src/get-stats');

const { PROXY, TOKEN, HOST, PORT, CHAT_ID } = process.env;

const options = {};

if (PROXY) {
    const agent = new SocksAgent({
        socksHost: PROXY.split(':')[0],
        socksPort: PROXY.split(':')[1]
    });
    options.telegram = { agent };
    axios.defaults.httpsAgent = agent;
}

async function processText(text = '') {
    const names = getNames(text);

    if (names && names.length) {
        const packages = await Promise.all(names.map(n => getStats(n).catch(() => null)));
        const gotPackages = packages.filter(p => p)
        return getLocalImage(gotPackages);
    }
}

const bot = new Telegraf(TOKEN, options);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me package names'));

bot.on('text', async ({ replyWithPhoto, message }) => {
	try {
        console.log('Received message. Processing', message.text);
		const imagePath = await processText(message.text);
		if (imagePath) {
			await replyWithPhoto(`${HOST}${imagePath}`);
		}
	} catch (e) {
		console.warn(e);
	}
});

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    try {
        console.log('Received inline. Processing', inlineQuery.query);
        const imagePath = await processText(inlineQuery.query);
        if (imagePath) {
            const { photo, message_id } = await bot.telegram.sendPhoto(CHAT_ID, `${HOST}${imagePath}`);
            const large = photo.pop();
            const thumb = photo.shift() || large;

            await (new Promise(resolve => setTimeout(resolve, 100)));

            const results = [{
                type: 'photo',
                id: inlineQuery.id,
                description: inlineQuery.query,
                thumb_url: thumb.file_id,
                photo_url: large.file_id
            }];

            await answerInlineQuery(results);
            await bot.telegram.deleteMessage(CHAT_ID, message_id);
        }
    } catch (e) {
        console.warn(e);
    }
});

bot.telegram.setWebhook(`${HOST}/telegram-webhook`).then(() => {
    console.log('STARTED');
});

fastifyApp.use(bot.webhookCallback('/telegram-webhook'));

fastifyApp.get('/', (request, reply) => {
    reply.send({ npmstats: 'works' })
});

fastifyApp.register(require('fastify-static'), {
    root: path.join(__dirname, 'tmp'),
    prefix: '/tmp/',
});

fastifyApp.listen(PORT, '0.0.0.0');

