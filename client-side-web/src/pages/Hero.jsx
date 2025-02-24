"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-16 h-16 text-white/90" />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">PDF Summarizer</h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 font-light">
            Transform Documents into Insights
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-white/80 mb-12">
            Unlock the power of your PDFs with AI-driven analysis, summaries, and intelligent querying.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/upload"
              className="group px-8 py-4 bg-white rounded-full text-primary font-semibold text-lg 
                       hover:bg-opacity-90 transition-all duration-300 ease-in-out flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

export default Hero

