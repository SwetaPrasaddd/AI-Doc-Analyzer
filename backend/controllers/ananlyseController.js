const { fetchHTMLContent } = require('../services/fetchHTML');
const { getReadabilityScores, extractMainText } = require('../utils/readability');
const { analyzeWithGemini } = require('../services/gemini');
const { reviseWithGemini } = require('../services/reviseWithGemini');

exports.analyzeDoc = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const htmlContent = await fetchHTMLContent(url);

        // Extract main textual content from HTML
        const mainText = extractMainText(htmlContent);

        const readability = getReadabilityScores(mainText);

        const geminiResponse = await analyzeWithGemini(mainText, url, readability);
        // ✅ STEP 3: Generate revised version
        const revisedContent = await reviseWithGemini(mainText, geminiResponse, url);
        res.json({ readability, geminiAnalysis: geminiResponse, revisedContent });
    } catch (err) {
        console.error('Error analyzing document:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};
