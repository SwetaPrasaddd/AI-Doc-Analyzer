import React, { useState } from 'react';

const Upload = () => {
    const [url, setUrl] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [revised, setRevised] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAnalysis('');
        setRevised('');

        try {
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.geminiAnalysis && data.revisedContent) {
                    setAnalysis(data.geminiAnalysis);
                    setRevised(data.revisedContent);
                } else {
                    setError('Analysis completed, but incomplete response from server.');
                }
            } else {
                setError(data.error || `Server error: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to connect to the analysis service. Please ensure the backend is running.');
        }

        setLoading(false);
    };

    const downloadAsFile = (filename, content) => {
        if (!content) return;
        const blob = new Blob([content], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">
                    AI Doc Analyzer
                </h2>

                {/* Input Field and Analyze Button */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="url" className="block text-lg font-semibold text-gray-700 mb-2">
                            🔗 MoEngage Article URL:
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://help.moengage.com/hc/en-us/articles/..."
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing...' : ' Analyze'}
                    </button>
                </form>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 text-red-600 font-medium text-center bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* Analysis and Revised Content */}
                {(analysis || revised) && (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Analysis */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-indigo-700">
                                    AI Analysis
                                </h3>
                                <button
                                    onClick={() => downloadAsFile('analysis_report.txt', analysis)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-200 shadow"
                                >
                                    ⬇ Download
                                </button>
                            </div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-800 whitespace-pre-wrap text-sm overflow-x-auto shadow-inner">
                                {analysis}
                            </pre>
                        </div>

                        {/* Revised Version */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-green-700">
                                    Revised Version
                                </h3>
                                <button
                                    onClick={() => downloadAsFile('revised_content.txt', revised)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition duration-200 shadow"
                                >
                                    ⬇️ Download
                                </button>
                            </div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-800 whitespace-pre-wrap text-sm overflow-x-auto shadow-inner">
                                {revised}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
