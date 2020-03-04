const puppeteer = require('puppeteer');

let page;

module.exports = async () => {
	if (!page) {
		// Launch browser
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		// Open new page
		page = await browser.newPage();
		// Set viewport to something big
		// Prevents Carbon from cutting off lines
		await page.setViewport({
			width: 3840,
			height: 1000,
			deviceScaleFactor: 1
		});
	}

	return page;
};
