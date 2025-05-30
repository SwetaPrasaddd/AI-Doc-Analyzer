const express = require('express');
const dotenv = require('dotenv');
const analyzeRoute = require('./routes/analyseRoute');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/analyze', analyzeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
