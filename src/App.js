import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/components/Home';
import QuizSelectionScreen from '../src/components/QuizSelectionScreen'; // Trang chọn màn
import QuizQuestions from '../src/components/quizQuestions';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route đến trang bắt đầu */}
        <Route path="/" element={<Home />} />
        {/* Route đến trang chọn màn */}
        <Route path="/quiz-selection" element={<QuizSelectionScreen />} />
        <Route path="/level/:levelId" element={<QuizQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
