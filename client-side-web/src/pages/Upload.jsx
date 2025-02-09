import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, Search, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import PdfLoader from '../components/PdfLoader';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`https://7d5e-2409-40c0-78-b86a-853d-6736-7c3f-1ff1.ngrok-free.app/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setUploadStatus(result.message);
      if (response.status === 201) {
        setTimeout(() => navigate('/action'), 2000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 text-white p-4 md:p-8">
      <Link to="/" className="fixed top-4 left-4 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors z-10">
        Go back to Home
      </Link>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 mt-16 text-white">Upload Your PDF</h1>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/30 border-dashed rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-white" />
                  <p className="mb-2 text-sm text-white">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-white/70">PDF file only</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {file && (
              <div className="mt-4">
                <p className="font-semibold text-white">Selected file:</p>
                <p className="text-white/70">{file.name}</p>
                <button
                  className="mt-4 px-6 py-2 bg-white/10 text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors"
                  onClick={handleSubmit}
                >
                  Upload PDF
                </button>
              </div>
            )}
          </div>
          <div className="space-y-6 text-white">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold">1. Upload Your PDF</h3>
                  <p className="text-white/70">Upload your high-quality PDF documents, ensuring it has clear and sharp pages.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold">2. AI Processing</h3>
                  <p className="text-white/70">Our AI will analyze and process your document, extracting key information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-6 h-6 mt-1 text-white" />
                <div>
                  <h3 className="font-semibold">3. Interact and Query</h3>
                  <p className="text-white/70">Ask questions, get summaries, and explore your document's content with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Quick Summaries</h3>
              <p className="text-white/70">Get concise summaries of your PDF documents in seconds.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Table Explanations</h3>
              <p className="text-white/70">Understand complex tables with AI-powered explanations.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Smart Q&A</h3>
              <p className="text-white/70">Ask questions about your PDF and get accurate answers instantly.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white/10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">What file types are supported?</h3>
              <p className="text-white/70">Currently, we support PDF files only. We're working on expanding to other document types in the future.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Is my data secure?</h3>
              <p className="text-white/70">We prioritize data security. While your documents are stored on our servers, we ensure they are handled securely and protected at all times.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">How accurate are the summaries and answers?</h3>
              <p className="text-white/70">Our AI models are highly accurate, but as with any AI system, there's always a small margin for error. We recommend using the tool as an aid rather than a replacement for thorough reading.</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <PdfLoader />}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-md ${uploadStatus.includes("successfully") ? "bg-green-600/50" : "bg-red-600/50"}`}>
          {uploadStatus.includes("successfully") ? (
            <CheckCircle className="inline-block mr-2 h-5 w-5" />
          ) : (
            <AlertCircle className="inline-block mr-2 h-5 w-5" />
          )}
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default UploadPage;