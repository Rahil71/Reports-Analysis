import React, { useState, useEffect } from 'react';
import { FileText, Table, Mic, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
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
      const response = await fetch(`https://3042-2409-40c0-3c-2fcd-7d3d-afaa-e227-80b8.ngrok-free.app/get_collection_names`, {
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
      const response = await fetch(`https://3042-2409-40c0-3c-2fcd-7d3d-afaa-e227-80b8.ngrok-free.app${endpoint}`, {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-background text-text p-4 md:p-8"
    >
      <Link to="/upload" className="fixed top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200 
                   text-primary rounded-full text-sm font-semibold hover:bg-white transition-colors z-10 
                   flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />Back to Upload
      </Link>
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-5xl font-bold text-center mb-8 text-primary pt-16"
      >
        PDF Analysis
      </motion.h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('Summarize')}
            >
              <FileText className="mr-2" /> Summarize PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg text-lg font-semibold hover:bg-secondary-dark transition-colors flex items-center justify-center"
              onClick={() => handleSubmit('ExplainTables')}
            >
              <Table className="mr-2" /> Explain Tables
            </motion.button>
          </div>

          <div>
            <label htmlFor="ask-pdf" className="block text-sm font-medium text-text mb-2">Ask PDF</label>
            <div className="flex flex-col space-y-2">
              <select
                id="pdf-options"
                className="p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-text"
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
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-text"
                  placeholder="Type your question here"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
                  onClick={() => handleSubmit('AskPDF', { user_question: question, selected_option: selectedOption })}
                >
                  Ask
                </motion.button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="query" className="block text-sm font-medium text-text mb-2">Query</label>
            <div className="flex flex-col space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-secondary text-white rounded-lg text-lg font-semibold hover:bg-secondary-dark transition-colors flex items-center justify-center"
                onClick={handleVoiceInput}
              >
                <Mic className="mr-2" /> Start Voice Input
              </motion.button>
              {transcribedText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2 bg-gray-100 rounded text-text"
                >
                  <p className="font-semibold">Transcribed Text:</p>
                  <p>{transcribedText}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 text-primary">Results</h2>
            
            {actionType === 'Summarize' && result.summary && (
              <div className="text-text">
                <strong className="text-primary">Summary:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.summary}</ReactMarkdown>
              </div>
            )}

            {actionType === 'ExplainTables' && result.table_explanation && (
              <div className="text-text">
                <strong className="text-primary">Table Explanation:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.table_explanation}</ReactMarkdown>
              </div>
            )}

            {(actionType === 'AskPDF' || actionType === 'Query') && result.answer && (
              <div className="text-text">
                <strong className="text-primary">Answer:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.answer}</ReactMarkdown>
              </div>
            )}

            {result.error && (
              <div className="text-red-600">
                <strong>Error:</strong>
                <p>{result.error}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      {isLoading && <PdfLoader />}
    </motion.div>
  );
};

export default ActionPage;
