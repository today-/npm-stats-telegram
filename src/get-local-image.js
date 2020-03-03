const generate = require('nanoid/generate');
const initBrowser = require('./init-browser');
const getLocalTemplate = require('./local/template');

const IMG_TYPE = 'png';

module.exports = async (stats) => {
	const newString = getLocalTemplate(stats);

	const SAVE_DIRECTORY = `${process.cwd()}/tmp`;
	const FILE_NAME = `${generate('123456abcdef', 10)}.${IMG_TYPE}`;
	const FULL_SAVE_PATH = `${SAVE_DIRECTORY}/${FILE_NAME}`;

	const page = await initBrowser();

	await page.setContent(newString);

	const exportContainer = await page.$('#content');

	const elementBounds = await exportContainer.boundingBox();

	await page.screenshot({
		path: FULL_SAVE_PATH,
		type: 'png',
		clip: {
			...elementBounds,
			x: Math.round(elementBounds.x),
			height: Math.round(elementBounds.height) - 1
		}
	});

	return `/tmp/${FILE_NAME}`
};
