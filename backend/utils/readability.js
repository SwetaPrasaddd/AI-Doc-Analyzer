const TextStatistics = require('text-statistics');

exports.getReadabilityScores = (text) => {
    const stats = new TextStatistics(text);
    return {
        fleschKincaid: stats.fleschKincaidReadingEase(),
        gunningFog: stats.gunningFogScore(),
        readingLevel: stats.fleschKincaidGradeLevel()
    };
};
const cheerio = require('cheerio');

exports.extractMainText = (html) => {
    const $ = cheerio.load(html);

    // Try to extract main content: article, main, or body text fallback
    let mainText = '';

    if ($('article').length) {
        mainText = $('article').text();
    } else if ($('main').length) {
        mainText = $('main').text();
    } else {
        mainText = $('body').text();
    }

    // Clean up whitespace
    mainText = mainText.replace(/\s+/g, ' ').trim();

    return mainText;
};
