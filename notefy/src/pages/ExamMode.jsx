// src/pages/ExamMode.jsx
import { useState } from 'react';
import API from '../api.js';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

// ... (keep all other functions like scoreQuiz, resetQuiz, etc.) ...
// ... (keep all the STYLES at the bottom) ...

export default function ExamMode() {
  const [notesText, setNotesText] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const COLORS = { notes: '#6e48ff' };

  const scoreQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const resetQuiz = () => {
    setQuiz(null);
    setNotesText('');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const generateQuiz = async () => {
    if (notesText.length < 100) {
      return toast.error("Please paste at least 100 characters of text.");
    }
    setLoading(true);
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    
    try {
      const quizResponse = await API.post('/gemini/generate-quiz', { notesText });
      
      // --- FIX: Check if the 'quiz' property exists AND is an array ---
      let quizData = quizResponse.data;
      if (quizData.quiz && Array.isArray(quizData.quiz)) {
        // If AI returns { "quiz": [...] }
        quizData = quizData.quiz; 
      } else if (!Array.isArray(quizData)) {
        // If it's not an array and doesn't contain 'quiz', it's invalid
        console.error("Invalid quiz format from AI:", quizResponse.data);
        throw new Error("AI returned an invalid quiz format. Please try again.");
      }
      // --- END OF FIX ---

      setQuiz(quizData); // quizData is now guaranteed to be an array
      toast.success("Quiz generated successfully!");
      
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to generate quiz.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // --- END OF UPDATED FUNCTION ---

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  if (loading) {
    return <div style={{padding:'2rem'}}><h2>Generating Quiz...</h2><p>Please wait while the AI processes your input.</p></div>;
  }
  
  if (showResults) {
    const score = scoreQuiz();
    const percent = Math.round((score / quiz.length) * 100);
    return (
      <div style={{padding:'2rem', maxWidth: 600, margin: 'auto', textAlign: 'center'}}>
        <h2 style={{color: COLORS.notes}}>Quiz Results!</h2>
        <p style={{fontSize: '1.5rem'}}>You scored {score} out of {quiz.length} ({percent}%)</p>
        <button style={buttonStyle} onClick={resetQuiz}>Start New Quiz</button>
      </div>
    );
  }

  if (quiz) {
    const q = quiz[currentQuestion];
    const submitAnswer = (optionIndex) => setAnswers({ ...answers, [currentQuestion]: optionIndex });
    const isAnswered = answers[currentQuestion] !== undefined;

    return (
      <div style={{padding:'2rem', maxWidth: 700, margin: 'auto', textAlign: 'left'}}>
        <h2 style={{color: COLORS.notes}}>Question {currentQuestion + 1} of {quiz.length}</h2>
        <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>{q.question}</p>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {q.options.map((option, index) => (
            <button 
              key={index} 
              onClick={() => submitAnswer(index)} 
              style={{
                ...optionButton,
                border: answers[currentQuestion] === index ? '3px solid #6e48ff' : '1px solid #333'
              }}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
          <button style={buttonStyle} onClick={resetQuiz}>Exit Quiz</button>
          <button 
            style={buttonStyle} 
            onClick={nextQuestion} 
            disabled={!isAnswered}
          >
            {currentQuestion === quiz.length - 1 ? 'Show Results' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  }

  // Initial Input View (Textarea)
  return (
    <div style={{padding:'2rem', maxWidth: 800, margin: 'auto'}}>
      <h2 style={{color: COLORS.notes, textAlign: 'center'}}>AI Quiz Generator</h2>
      <p style={{color: '#aaa', marginBottom: '2rem', textAlign: 'center'}}>
        Paste the text content from your study notes or summaries below (minimum 100 characters).
      </p>
      <textarea 
        placeholder="Paste your compiled notes text here..." 
        value={notesText} 
        onChange={e => setNotesText(e.target.value)} 
        style={textAreaStyle} 
        rows={15}
      />
      <button onClick={generateQuiz} style={generateButton}>
        <FiSend style={{marginRight: '8px'}} /> Generate 10-Question Quiz
      </button>
    </div>
  );
}

// --- STYLES (Keep these exactly as they are) ---
const textAreaStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#2a2a2a',
  border: '1px solid #333',
  color: '#fff',
  padding: '1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  fontSize: '1rem',
  resize: 'vertical'
};

const buttonStyle = {
  background: '#6e48ff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  fontWeight: 600,
  fontSize: '0.9rem',
};

const generateButton = {
  ...buttonStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
};

const optionButton = {
  background: '#3a3a3a',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '1rem',
  textAlign: 'left',
  cursor: 'pointer'
};