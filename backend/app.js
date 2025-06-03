const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const analyzeRoute = require('./routes/analyseRoute');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/analyze', analyzeRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Gemini API key loaded ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});
