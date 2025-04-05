import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, Search, Zap, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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
      const response = await fetch(`https://346f-2409-40c0-105a-f8ed-e822-5606-442b-c5df.ngrok-free.app/upload`, {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-background text-text p-4 md:p-8"
    >
      <Link
        to="/"
        className="fixed top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200 
                   text-primary rounded-full text-sm font-semibold hover:bg-white transition-colors z-10 
                   flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-center mb-8 mt-16 text-primary"
        >
          Upload Your PDF
        </motion.h1>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-primary" />
                  <p className="mb-2 text-sm text-text">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-text-light">PDF file only</p>
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
                <p className="font-semibold text-text">Selected file:</p>
                <p className="text-text-light">{file.name}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
                  onClick={handleSubmit}
                >
                  Upload PDF
                </motion.button>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 text-text"
          ><div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold pb-4">How It Works</h2>
            <div className="space-y-4 ">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">1. Upload Your PDF</h3>
                  <p className="text-text-light">Upload your high-quality PDF documents, ensuring it has clear and sharp pages.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">2. AI Processing</h3>
                  <p className="text-text-light">Our AI will analyze and process your document, extracting key information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-6 h-6 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold">3. Interact and Query</h3>
                  <p className="text-text-light">Ask questions, get summaries, and explore your document's content with ease.</p>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 space-y-8"
        >
          <h2 className="text-2xl font-bold text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="w-8 h-8 mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Quick Summaries</h3>
              <p className="text-text-light">Get concise summaries of your PDF documents in seconds.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="w-8 h-8 mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Table Explanations</h3>
              <p className="text-text-light">Understand complex tables with AI-powered explanations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="w-8 h-8 mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Smart Q&A</h3>
              <p className="text-text-light">Ask questions about your PDF and get accurate answers instantly.</p>
            </div>
          </div>
        </motion.div>
      </div>
      {isLoading && <PdfLoader />}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-md ${uploadStatus.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {uploadStatus.includes("successfully") ? (
            <CheckCircle className="inline-block mr-2 h-5 w-5" />
          ) : (
            <AlertCircle className="inline-block mr-2 h-5 w-5" />
          )}
          {uploadStatus}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadPage;
