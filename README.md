# AI doc Analyzer

An AI-powered documentation analyzer and rewriter that evaluates the readability of MoEngage documentation URLs and generates improvement suggestions using Google Gemini.

## Features

- Extracts and analyzes the main content from public MoEngage article URLs
- Calculates readability scores: Flesch Reading Ease, Flesch-Kincaid Grade Level, and SMOG Index
- Uses Gemini flash to provide suggestions for improving structure, tone, and clarity
- Optionally rewrites the document with the suggested improvements
- Allows downloading the analysis report

## Setup Instructions:

### 1. Clone the Repository

git clone https://github.com/yourusername/mo-doc-optimizer.git
cd AI_Doc_Analyzer

### 2. Install Dependencies
Install required packages for both backend and frontend:

- cd backend
- npm install

- cd ../frontend
- npm install

### 3. Set Up Environment Variables
Create a .env file in the backend folder with the following:

GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
⚠️ Do not commit your API key.

### 4. Run the Application

Terminal 1 (Backend):
- cd server
- node app.js

Terminal 2 (Frontend):
- cd client
- npm run dev
Access the app at: http://localhost:3000

## Assumptions Made
- Users will provide publicly accessible - - MoEngage article URLs

- Only textual content is extracted (images, scripts, videos are ignored)

- Gemini's suggestions are assumed to be natural-language summaries

- The tool works best with MoEngage documentation but can generalize

## Design Choices & Approach

### Readability Analysis
- HTML is fetched using a custom fetcher (node-fetch) and parsed with cheerio

- Main content is extracted using class/element filtering

- Readability is calculated using:
    Flesch Reading Ease
    Flesch-Kincaid Grade Level
    SMOG Index

### Gemini-Powered Analysis
- The original content and its readability metrics are sent to Gemini

- Gemini returns:
    Suggestions for improving style, tone, clarity
    Critiques and observations about the current writing

## Revision Agent
- The original content and suggestions are sent again to Gemini

- Gemini responds with a revised, improved version of the article

- This rewritten content is returned alongside the analysis

## Challenges Faced
- Content Extraction: Removing noisy layout elements without removing relevant text

- Response Handling: Gemini outputs could exceed typical response size—needed overflow-safe UI

- API Rate Limits: Gemini key quota handling wasn’t implemented (can be added)

- Timeouts: Long Gemini requests occasionally timed out during testing

## Possible Improvements
- Show visual diffs between original and revised versions

- Let users choose which suggestions to apply (e.g., tone only, grammar only)

- Save and revisit past reports using a database

- Add authentication for tracking user-specific revisions

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- AI Integration: Google Gemini Pro API
- HTML Parsing: Cheerio
- Readability: text-readability package

## Contact
Sweta Kumari Prasad
📧 swetaprasad652@gmail.com

