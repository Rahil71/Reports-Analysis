"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            PDF Summarizer
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 font-light"
          >
            Transform Documents into Insights
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-white/80 mb-12"
          >
            Unlock the power of your PDFs with AI-driven analysis, summaries, and intelligent querying.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/upload"
              className="group px-8 py-4 bg-white rounded-full text-primary font-semibold text-lg 
                       hover:bg-opacity-90 transition-all duration-300 ease-in-out flex items-center gap-2
                       shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero

