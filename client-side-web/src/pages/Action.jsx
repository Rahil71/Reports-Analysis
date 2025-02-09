import React, { useState, useEffect } from 'react';
import { FileText, Table, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PdfLoader from '../components/PdfLoader';
import { Link } from 'react-router-dom';

const ActionPage = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [actionType, setActionType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [transcribedText, setTranscribedText] = useState('');

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch(`https://7d5e-2409-40c0-78-b86a-853d-6736-7c3f-1ff1.ngrok-free.app/get_collection_names`, {
        method: 'POST',
      });
      const data = await response.json();
      setDropdownOptions(data.data);
      if (data.data.length > 0) {
        setSelectedOption(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleSubmit = async (action, data = {}) => {
    setIsLoading(true);
    const formData = new FormData();

    let endpoint = "";

    switch (action) {
        case "Summarize":
            formData.append("action", "Summarize");
            formData.append("collection", selectedOption);
            endpoint = "/summarize";
            break;
        case "ExplainTables":
            formData.append("action", "ExplainTables");
            formData.append("collection", selectedOption);
            endpoint = "/explain-tables";
            break;
        case "AskPDF":
        case "Query":
            formData.append("user_question", data.user_question);
            formData.append("collection", data.selected_option || selectedOption);
            endpoint = "/query";
            break;
        default:
            console.error("Invalid action type");
            setIsLoading(false);
            return;
    }

    try {
        const response = await fetch(`https://7d5e-2409-40c0-78-b86a-853d-6736-7c3f-1ff1.ngrok-free.app${endpoint}`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        setResult(result);
        setActionType(action);
    } catch (error) {
        console.error("Error fetching data:", error);
        setResult({ error: "An error occurred while processing your request." });
    } finally {
        setIsLoading(false);
    }
};


  const handleVoiceInput = async () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscribedText(transcript);
        setQuestion(transcript);
      };

      recognition.start();
    } catch (error) {
      console.error('Error with speech recognition:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 text-white p-4 md:p-8">
      <Link to="/upload" className="fixed top-4 left-4 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors z-10">
        Go back to Upload
      </Link>
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-white pt-16">PDF Analysis</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('Summarize')}
            >
              <FileText className="mr-2" /> Summarize PDF
            </button>
            <button
              className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('ExplainTables')}
            >
              <Table className="mr-2" /> Explain Tables
            </button>
          </div>

          <div>
            <label htmlFor="ask-pdf" className="block text-sm font-medium text-white mb-2">Ask PDF</label>
            <div className="flex flex-col space-y-2">
              <select
                id="pdf-options"
                className="p-2 border border-white/30 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/10 text-white"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {dropdownOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  id="ask-pdf"
                  className="flex-1 p-2 border border-white/30 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/10 text-white"
                  placeholder="Type your question here"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg text-lg font-semibold hover:bg-purple-600 transition-colors"
                  onClick={() => handleSubmit('AskPDF', { user_question: question, selected_option: selectedOption })}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="query" className="block text-sm font-medium text-white mb-2">Query</label>
            <div className="flex flex-col space-y-2">
              <button
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center"
                onClick={handleVoiceInput}
              >
                <Mic className="mr-2" /> Start Voice Input
              </button>
              {transcribedText && (
                <div className="mt-2 p-2 bg-white/10 rounded text-white">
                  <p className="font-semibold">Transcribed Text:</p>
                  <p>{transcribedText}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white/10 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-white">Results</h2>
            
                      {actionType === 'Summarize' && result.summary && (
            <div className="text-white">
              <strong className="text-white">Summary:</strong>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.summary}</ReactMarkdown>
            </div>
          )}

          {actionType === 'ExplainTables' && result.table_explanation && (
            <div className="text-white">
              <strong className="text-white">Table Explanation:</strong>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.table_explanation}</ReactMarkdown>
            </div>
          )}

          {(actionType === 'AskPDF' || actionType === 'Query') && result.answer && (
            <div className="text-white">
              <strong className="text-white">Answer:</strong>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.answer}</ReactMarkdown>
            </div>
          )}

            {result.error && (
              <div className="text-red-400">
                <strong>Error:</strong>
                <p>{result.error}</p>
              </div>
            )}
          </div>
        )}

      </div>
      {isLoading && <PdfLoader />}
    </div>
  );
};

export default ActionPage;