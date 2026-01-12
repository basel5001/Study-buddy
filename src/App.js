import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const API_URL = 'https://7pz7euzg1d.execute-api.us-west-2.amazonaws.com/Dev'; // Replace with your API Gateway URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextInput = (e) => {
    setExtractedText(e.target.value);
  };

  const generateQuiz = async () => {
    if (!extractedText.trim()) {
      alert('Please enter or extract some study material first!');
      return;
    }

    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          numQuestions: numQuestions,
          difficulty: difficulty,
          type: 'multiple-choice'
        })
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 Study Buddy</h1>
        <p>AI-Powered Quiz Generator</p>
      </header>

      <div className="container">
        {/* Input Section */}
        <div className="input-section">
          <h2>📝 Study Material</h2>

          <div className="file-upload">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".txt,.pdf"
            />
            {file && <p>Selected: {file.name}</p>}
          </div>

          <textarea
            placeholder="Or paste your study material here..."
            value={extractedText}
            onChange={handleTextInput}
            rows={10}
          />

          <div className="settings">
            <label>
              Number of Questions:
              <input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              />
            </label>

            <label>
              Difficulty:
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading || !extractedText.trim()}
            className="generate-btn"
          >
            {loading ? '⏳ Generating...' : '✨ Generate Quiz'}
          </button>
        </div>

        {/* Quiz Section */}
        {questions.length > 0 && (
          <div className="quiz-section">
            <h2>📚 Your Quiz</h2>

            {questions.map((q, index) => (
              <div key={index} className="question-card">
                <h3>Question {index + 1}</h3>
                <p className="question-text">{q.question}</p>

                <div className="options">
                  {q.options.map((option, optIndex) => {
                    const optionLetter = option.charAt(0);
                    const isSelected = selectedAnswers[index] === optionLetter;
                    const isCorrect = q.correctAnswer === optionLetter;

                    let className = 'option';
                    if (showResults) {
                      if (isCorrect) className += ' correct';
                      else if (isSelected) className += ' incorrect';
                    } else if (isSelected) {
                      className += ' selected';
                    }

                    return (
                      <button
                        key={optIndex}
                        className={className}
                        onClick={() => handleAnswerSelect(index, optionLetter)}
                        disabled={showResults}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="explanation">
                    <strong>✓ Correct Answer: {q.correctAnswer}</strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {!showResults ? (
              <button onClick={submitQuiz} className="submit-btn">
                Submit Quiz
              </button>
            ) : (
              <div className="results">
                <h2>🎉 Results</h2>
                <p className="score">
                  You scored {calculateScore()} out of {questions.length}
                </p>
                <p className="percentage">
                  ({Math.round((calculateScore() / questions.length) * 100)}%)
                </p>
                <button onClick={() => {
                  setQuestions([]);
                  setSelectedAnswers({});
                  setShowResults(false);
                }} className="generate-btn">
                  Generate New Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;