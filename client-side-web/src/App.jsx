import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from './pages/Hero';
import Upload from './pages/Upload';
import Action from './pages/Action';

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/action" element={<Action />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
