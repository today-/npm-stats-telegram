require('dotenv').config();
// const path = require('path');
const Telegraf = require('telegraf');
const axios = require('axios');
// const fastifyApp = require('fastify')({ trustProxy: true });
const SocksAgent = require('socks5-https-client/lib/Agent');
const getLocalImage = require('./src/get-local-image');
const getStats = require('./src/get-stats');

const { PROXY, TOKEN } = process.env;

const options = {};

if (PROXY) {
    const agent = new SocksAgent({
        socksHost: PROXY.split(':')[0],
        socksPort: PROXY.split(':')[1]
    });
    options.telegram = { agent };
    axios.defaults.httpsAgent = agent;
}

const bot = new Telegraf(TOKEN, options);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me text'));

bot.on('text', async ({ reply, message }) => {
	console.log('Received message. Processing', message.text);

	try {
		const stats = await getStats(message.text);

		if (stats) {
			const imagePath = await getLocalImage(stats);

            await reply(imagePath);
			// await replyWithPhoto(`${HOST}${imagePath}`);
		}
	} catch (e) {
		console.warn(e);
	}
});

bot.launch().then(() => console.log('STARTED'));
