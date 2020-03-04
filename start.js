require('dotenv').config();
// const path = require('path');
const Telegraf = require('telegraf');
const axios = require('axios');
const fs = require('fs');
// const fastifyApp = require('fastify')({ trustProxy: true });
const SocksAgent = require('socks5-https-client/lib/Agent');
const getLocalImage = require('./src/get-local-image');
const getNames = require('./src/get-names');
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
	console.log('Received message. Processing', message.text);

	try {
		const imagePath = await processText(message.text);

		if (imagePath) {
			await replyWithPhoto({ source: fs.createReadStream(`./${imagePath}`) });
		}
	} catch (e) {
		console.warn(e);
	}
});

bot.launch().then(() => console.log('STARTED'));
