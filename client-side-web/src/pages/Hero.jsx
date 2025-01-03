import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900">
      {/* Decorative waves - top */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full opacity-30">
          <div className="absolute top-16 left-0 right-0 h-32 bg-purple-400/20 blur-3xl transform -rotate-3"></div>
          <div className="absolute top-8 left-1/4 right-0 h-24 bg-purple-300/20 blur-3xl transform rotate-6"></div>
        </div>
      </div>

      {/* Landing image */}
      <div className="absolute top-32 right-0 md:right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72">
        <img src="/landing.png" alt="Landing illustration" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
          Equitec
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white/90 mb-6">
          Extracting Insights
        </h2>
        <p className="max-w-2xl text-base sm:text-lg text-white/70 mb-8 sm:mb-12">
        Bridge the gap between documents and decision-making with smart queries.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/upload"
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white text-base sm:text-lg font-semibold 
                     backdrop-blur-sm bg-white/10 border border-white/20 
                     transition-all hover:bg-white/20 hover:scale-105
                     active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Decorative waves - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-purple-800 blur-2xl transform -rotate-3"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-purple-900 blur-2xl transform rotate-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;