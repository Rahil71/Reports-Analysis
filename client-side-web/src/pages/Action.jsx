"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FileText, Mic, ArrowLeft, Send, BookOpen, TableProperties, MessageSquare } from "lucide-react"
import PdfLoader from "../components/PdfLoader"

const ActionPage = () => {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState(null)
  const [actionType, setActionType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState("")
  const [transcribedText, setTranscribedText] = useState("")

  useEffect(() => {
    fetchDropdownOptions()
  }, [])

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch(
        `https://3042-2409-40c0-3c-2fcd-7d3d-afaa-e227-80b8.ngrok-free.app/get_collection_names`,
        {
          method: "POST",
        },
      )
      const data = await response.json()
      setDropdownOptions(data.data)
      if (data.data.length > 0) {
        setSelectedOption(data.data[0])
      }
    } catch (error) {
      console.error("Error fetching dropdown options:", error)
    }
  }

  const handleSubmit = async (action, data = {}) => {
    setIsLoading(true)
    const formData = new FormData()

    let endpoint = ""

    switch (action) {
      case "Summarize":
        formData.append("action", "Summarize")
        formData.append("collection", selectedOption)
        endpoint = "/summarize"
        break
      case "ExplainTables":
        formData.append("action", "ExplainTables")
        formData.append("collection", selectedOption)
        endpoint = "/explain-tables"
        break
      case "AskPDF":
      case "Query":
        formData.append("user_question", data.user_question)
        formData.append("collection", data.selected_option || selectedOption)
        endpoint = "/query"
        break
      default:
        console.error("Invalid action type")
        setIsLoading(false)
        return
    }

    try {
      const response = await fetch(`https://3042-2409-40c0-3c-2fcd-7d3d-afaa-e227-80b8.ngrok-free.app${endpoint}`, {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      setResult(result)
      setActionType(action)
    } catch (error) {
      console.error("Error fetching data:", error)
      setResult({ error: "An error occurred while processing your request." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = async () => {
    try {
      const recognition = new window.webkitSpeechRecognition()
      recognition.lang = "en-US"

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscribedText(transcript)
        setQuestion(transcript)
      }

      recognition.start()
    } catch (error) {
      console.error("Error with speech recognition:", error)
    }
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-background to-white pb-12"
    >
      <Link
        to="/upload"
        className="fixed top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200 
                   text-primary rounded-full text-sm font-semibold hover:bg-white transition-colors z-10 
                   flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upload
      </Link>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-primary"
        >
          PDF Analysis
        </motion.h1>

        <motion.div variants={containerAnimation} initial="hidden" animate="show" className="grid gap-6 sm:gap-8">
          {/* Quick Actions Section */}
          <motion.div variants={itemAnimation} className="grid sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmit("Summarize")}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
                       flex items-center gap-4 group hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center 
                          group-hover:bg-primary/20 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-primary">Summarize PDF</h3>
                <p className="text-sm text-gray-600">Get a quick overview of your document</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmit("ExplainTables")}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
                       flex items-center gap-4 group hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center 
                          group-hover:bg-secondary/20 transition-colors"
              >
                <TableProperties className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-secondary">Explain Tables</h3>
                <p className="text-sm text-gray-600">Understand complex tables easily</p>
              </div>
            </motion.button>
          </motion.div>

          {/* Ask PDF Section */}
          <motion.div
            variants={itemAnimation}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Ask PDF</h2>
            </div>

            <div className="space-y-4">
              <select
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 
                         focus:border-primary transition-all outline-none bg-white"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {dropdownOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 
                           focus:border-primary transition-all outline-none"
                  placeholder="Ask a question about your PDF..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit("AskPDF", { user_question: question, selected_option: selectedOption })}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark 
                           transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                >
                  <Send className="w-4 h-4" />
                  Ask
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVoiceInput}
                className="w-full p-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 
                         transition-all flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Use Voice Input
              </motion.button>

              {transcribedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p className="font-medium text-sm text-gray-600">Transcribed Text:</p>
                  <p className="text-gray-800 mt-1">{transcribedText}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          {result && (
            <motion.div
              variants={itemAnimation}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Results</h2>
              </div>

              <div className="prose max-w-none">
                {actionType === "Summarize" && result.summary && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-primary">Summary</h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700">
                        {result.summary}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {actionType === "ExplainTables" && result.table_explanation && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary">Table Explanation</h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700">
                        {result.table_explanation}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {(actionType === "AskPDF" || actionType === "Query") && result.answer && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-primary">Answer</h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700">
                        {result.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {result.error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                  >
                    <strong>Error:</strong>
                    <p>{result.error}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      {isLoading && <PdfLoader />}
    </motion.div>
  )
}

export default ActionPage

