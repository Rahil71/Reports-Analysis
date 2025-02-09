import { useState, useEffect } from 'react';
import { Upload, Mic, FileText, Table } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PdfLoader from './components/PdfLoader';
import GradientButton from './components/GradientButton';

export default function App() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [actionType, setActionType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [showPdfLoader, setShowPdfLoader] = useState(false);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch(`https://aa4b-103-154-26-137.ngrok-free.app/get_collection_names`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);
      setDropdownOptions(data.data);
      if (data.data.length > 0) {
        setSelectedOption(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (action, data = {}) => {
    setIsLoading(true);
    if (action === 'upload') {
      setShowPdfLoader(true);
    }
    const formData = new FormData();
  
    let endpoint = "";
  
    switch (action) {
      case "upload":
        files.forEach((file) => formData.append("file", file));
        endpoint = "/upload";
        break;
      case "Summarize":
        formData.append("action", "Summarize");
        endpoint = "/summarize";
        break;
      case "ExplainTables":
        formData.append("action", "ExplainTables");
        endpoint = "/explain-tables";
        break;
      case "AskPDF":
        formData.append("user_question", data.user_question);
        formData.append("collection", data.selected_option);
        endpoint = "/query";
        break;
      case "Query":
        formData.append("user_question", data.user_question);
        formData.append("collection", data.selected_option);
        endpoint = "/query";
        break;
      default:
        console.error("Invalid action type");
        return;
    }
  
    try {
      console.log("Sending request to backend with action:", action);
      const response = await fetch(`https://aa4b-103-154-26-137.ngrok-free.app${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Response from backend:", result);
      setResult(result);
      setActionType(action);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setShowPdfLoader(false);
      }, 3000);
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
    <div className="min-h-screen w-full bg-gray-900 text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-8 text-purple-400">PDF Analysis</h1>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {showPdfLoader ? <PdfLoader /> : <div className="loader"></div>}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Upload PDF(s)</h2>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-purple-400" />
                <p className="mb-2 text-sm text-gray-400">
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
              <p className="font-semibold text-purple-300">Selected files:</p>
              <ul className="list-disc list-inside text-gray-300">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <GradientButton
                className="mt-4"
                onClick={() => handleSubmit('upload')}
              >
                Upload PDFs
              </GradientButton>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Actions</h2>

          <div className="flex space-x-4">
            <GradientButton
              className="flex-1"
              onClick={() => handleSubmit('Summarize')}
            >
              <FileText className="mr-2" /> Summarize PDF
            </GradientButton>
            <GradientButton
              className="flex-1"
              onClick={() => handleSubmit('ExplainTables')}
            >
              <Table className="mr-2" /> Explain Tables
            </GradientButton>
          </div>

          <div>
            <label htmlFor="ask-pdf" className="block text-sm font-medium text-gray-300 mb-2">Ask PDF</label>
            <div className="flex flex-col space-y-2">
              <select
                id="pdf-options"
                className="p-2 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {dropdownOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="flex">
                <input
                  type="text"
                  id="ask-pdf"
                  className="flex-1 p-2 border border-gray-600 rounded-l-md focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                  placeholder="Type your question here"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <GradientButton
                  onClick={() => handleSubmit('AskPDF', { user_question: question, selected_option: selectedOption })}
                >
                  Ask
                </GradientButton>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">Query</label>
            <div className="flex flex-col space-y-2">
              <GradientButton onClick={handleVoiceInput}>
                <Mic className="mr-2" /> Start Voice Input
              </GradientButton>
              {transcribedText && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-gray-300">
                  <p className="font-semibold">Transcribed Text:</p>
                  <p>{transcribedText}</p>
                </div>
              )}
              <div className="flex">
                <input
                  type="text"
                  id="query"
                  className="flex-1 p-2 border border-gray-600 rounded-l-md focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                  placeholder="Edit your query here"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <GradientButton
                  onClick={() => handleSubmit('Query', { user_question: question })}
                >
                  Submit Query
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Results</h2>
            
            {actionType === 'Summarize' && result.summary && (

              <div className="text-gray-300">

                <strong className="text-purple-300">Summary:</strong>

                <ReactMarkdown>{result.summary}</ReactMarkdown>

              </div>

              )}

              {actionType === 'ExplainTables' && result.table_explanation && (

              <div className="text-gray-300">

                <strong className="text-purple-300">Table Explanation:</strong>

                <ReactMarkdown>{result.table_explanation}</ReactMarkdown>

              </div>

              )}

              {(actionType === 'AskPDF' || actionType === 'Query') && result.answer && (

              <div className="text-gray-300">

                <strong className="text-purple-300">Answer:</strong>

                <ReactMarkdown>{result.answer}</ReactMarkdown>

              </div>

              )}
            {actionType === 'upload' && result.uploaded_files && (
              <ul className="list-disc list-inside text-gray-300">
                {result.uploaded_files.map((file, index) => <li key={index}>{file}</li>)}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No results to display yet.</p>
        )}
      </div>
    </div>
  );
}