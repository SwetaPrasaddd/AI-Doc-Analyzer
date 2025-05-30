const axios = require('axios');
const puppeteer = require('puppeteer');

async function fetchWithAxios(url) {
    const response = await axios.get(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            Accept: 'text/html',
        },
        timeout: 10000,
    });

    // Try to get meaningful content
    const content = response.data;
    if (!content || content.length < 500) {
        throw new Error('Content too short, likely blocked or dynamic site');
    }
    return content;
}

async function fetchWithPuppeteer(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const content = await page.evaluate(() => document.body.innerText);

        if (!content || content.length < 500) {
            throw new Error('Content too short from Puppeteer');
        }

        return content;
    } finally {
        if (browser) await browser.close();
    }
}

exports.fetchHTMLContent = async (url) => {
    try {
        console.log(`[INFO] Trying axios for ${url}`);
        return await fetchWithAxios(url);
    } catch (axiosErr) {
        console.warn(`[WARN] Axios failed: ${axiosErr.message}. Retrying with Puppeteer...`);
        try {
            return await fetchWithPuppeteer(url);
        } catch (puppeteerErr) {
            console.error(`[ERROR] Puppeteer also failed: ${puppeteerErr.message}`);
            throw new Error(`Failed to fetch content from URL: ${url}`);
        }
    }
};
