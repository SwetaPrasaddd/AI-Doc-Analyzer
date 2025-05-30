const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.reviseWithGemini = async (originalText, suggestions, url) => {
    try {
        const prompt = `
You are an expert editor.

Your task is to revise a technical documentation article using the following improvement suggestions.

DO NOT add new sections, examples, or explanations. ONLY simplify, rephrase, or rewrite text for better readability and friendly tone. Do not remove any original information.

URL: ${url}

==== SUGGESTIONS ====
${suggestions}

==== ORIGINAL ARTICLE ====
${originalText.substring(0, 8000)}

==== INSTRUCTIONS ====
- Keep the original structure and length mostly intact.
- Make sentences clearer, less complex.
- Use simpler words where possible.
- Convert formal/robotic tone into a more conversational but professional tone.
- DO NOT use markdown or HTML in the output.

Now return the **revised version** of the original article:
    `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCQo08Ug_44XysT2MVIgLkIizdlhAkk768`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return (
            response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No valid revision from Gemini"
        );
    } catch (error) {
        console.error("Revision Gemini Error:", error.response?.data || error.message);
        return `Error from Revision Agent: ${error.response?.data?.error?.message || error.message}`;
    }
};
