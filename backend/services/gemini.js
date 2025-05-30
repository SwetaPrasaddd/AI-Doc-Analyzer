const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.analyzeWithGemini = async (content, url, readability) => {
    try {
        const prompt = `
You are an expert technical writing assistant. Analyze the following technical documentation from the given URL: ${url}

Please assess the article based on the following criteria and provide a structured, well-formatted report using simple bullet points. Do not use any markdown formatting like asterisks (**) or hashes (#). Just use plain text with natural emphasis on important words using capitalization or strong wording.

1. Readability for a Marketer:
   - Evaluate how easily a NON-TECHNICAL MARKETER can understand the content.
   - Use standard readability metrics (e.g., Flesch-Kincaid, Gunning Fog) if applicable, or perform a qualitative assessment.
   - Explain WHY the article is or isn't readable for this audience.
   - Provide CLEAR and ACTIONABLE suggestions (e.g., "Sentence X is too complex, simplify or split it.")

2. Structure and Flow:
   - Analyze the overall STRUCTURE: use of headings, subheadings, paragraph length, bullet points, etc.
   - Assess whether the content FLOWS LOGICALLY and is easy to navigate for someone searching for specific information.
   - Provide suggestions to IMPROVE FLOW or reorganize the article, if needed.

3. Completeness of Information and Examples:
   - Determine whether the article contains ENOUGH DETAIL to enable a user to understand and implement the concept or feature.
   - Evaluate the CLARITY, RELEVANCE, and SUFFICIENCY of examples.
   - Suggest where EXAMPLES could be added or enhanced to improve comprehension.

4. Adherence to Simplified Style Guidelines (based on principles from the Microsoft Style Guide):
   - VOICE AND TONE: Is the content customer-focused, clear, and friendly?
   - CLARITY AND CONCISENESS: Are there unnecessarily complex sentences or jargon that should be simplified?
   - ACTION-ORIENTED LANGUAGE: Does the article guide the user with clear, actionable instructions?

For each of the above criteria, include:
- A short evaluation
- Specific, actionable suggestions for improvement

Also include:
- The URL analyzed: ${url}
- Any readability scores or metrics: ${JSON.stringify(readability)}

Content:
${content.substring(0, 10000)}
    `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCQo08Ug_44XysT2MVIgLkIizdlhAkk768`,
            {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return (
            response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'No valid response from Gemini API'
        );
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        return `Error from Gemini: ${error.response?.data?.error?.message || error.message}`;
    }
};
