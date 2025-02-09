import { useState } from 'react';
import { Upload, Mic, Search, FileText, Table } from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [actionType, setActionType] = useState(''); // Track the type of action for better display
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (action, data = {}) => {
    setIsLoading(true); // Show loader
    const formData = new FormData();
  
    let endpoint = ""; // Variable to store the endpoint for each action
  
    switch (action) {
      case "upload":
        files.forEach((file) => formData.append("pdf_files", file));
        endpoint = "/upload"; // Upload route
        break;
      case "Summarize":
        formData.append("action", "Summarize");
        endpoint = "/summarize"; // Summarize route
        break;
      case "ExplainTables":
        formData.append("action", "ExplainTables");
        endpoint = "/explain-tables"; // Explain tables route
        break;
      case "AskQuestion":
        formData.append("user_question", data.user_question);
        endpoint = "/query"; // Ask question route
        break;
      case "Search":
        formData.append("search_query", data.search_query);
        endpoint = "/search"; // Search route
        break;
      case "VoiceInput":
        endpoint = "/voice-input"; // Voice input route
        break;
      default:
        console.error("Invalid action type");
        return;
    }
  
    try {
      console.log("Sending request to backend with action:", action);
      const response = await fetch(`https://17eb-103-154-26-137.ngrok-free.app${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Response from backend:", result);
      setResult(result); // Update state with the backend response
      setActionType(action); // Set the action type for tailored display
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      {/* Add styles here */}
      <style>
        {`
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <h1 className="text-5xl font-bold text-center mb-8 text-blue-900">PDF Analysis</h1>

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Rest of your app */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Upload PDF(s)</h2>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-blue-700" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">Selected files:</p>
              <ul className="list-disc list-inside">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <button
                className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                onClick={() => handleSubmit('upload')}
              >
                Upload PDFs
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Actions</h2>

          {/* Summarize and Explain Tables */}
          <div className="flex space-x-4">
            <button
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('Summarize')}
            >
              <FileText className="mr-2" /> Summarize PDF
            </button>
            <button
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('ExplainTables')}
            >
              <Table className="mr-2" /> Explain Tables
            </button>
          </div>

          {/* Ask Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">Ask a Question</label>
            <div className="flex">
              <input
                type="text"
                id="question"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition-colors"
                onClick={() => handleSubmit('AskQuestion', { user_question: question })}
              >
                Ask
              </button>
            </div>
          </div>

          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Search PDF Content</label>
            <div className="flex">
              <input
                type="text"
                id="search"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-r-md hover:bg-yellow-700 transition-colors flex items-center"
                onClick={() => handleSubmit('Search', { search_query: searchQuery })}
              >
                <Search className="mr-2" /> Search
              </button>
            </div>
          </div>

          {/* Voice Input */}
          <button
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
            onClick={() => handleSubmit('VoiceInput')}
          >
            <Mic className="mr-2" /> Ask Question (Voice Input)
          </button>
        </div>

        {/* Results Section */}
        {/* Results Section */}
        {result ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">Results</h2>
            
            {actionType === 'Summarize' && result.summary && <p><strong>Summary:</strong> {result.summary}</p>}
            {actionType === 'ExplainTables' && result.table_explanation && <p><strong>Table Explanation:</strong> {result.table_explanation}</p>}
            {actionType === 'AskQuestion' && result.answer && <p><strong>Answer:</strong> {result.answer}</p>}
            {actionType === 'Search' && result.search_results && result.search_results.length > 0 && (
              <ul>
                {result.search_results.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            )}
            {actionType === 'upload' && result.uploaded_files && (
              <ul>
                {result.uploaded_files.map((file, index) => <li key={index}>{file}</li>)}
              </ul>
            )}

            {/* Added Voice Input case */}
            {actionType === 'VoiceInput' && result.answer && (
              <div>
                <strong>Answer from Voice Input:</strong>
                <p>{result.answer}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No results to display yet.</p>
        )}

      </div>
    </div>
  );
}