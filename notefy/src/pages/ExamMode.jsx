// src/pages/ExamMode.jsx
import { useState, useEffect, useMemo } from 'react';
import API from '../api.js';
import { FiSend, FiFlag, FiChevronRight, FiTrash2, FiChevronLeft, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- STYLES (Grouped at the top for clarity) ---
const COLORS = { 
  notes: '#6e48ff',
  flagged: '#ffc107',
  answered: '#198754', // <-- CHANGED TO GREEN
  active: '#6e48ff',
  default: '#2a2a2a'
};

const baseButtonStyle = {
  background: '#6e48ff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  fontWeight: 600,
  fontSize: '0.9rem',
};

const sidebarStyle = {
  width: '240px',
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '1rem',
  height: 'fit-content'
};

const paletteStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '10px'
};

const paletteButtonStyle = {
  background: COLORS.default,
  border: '1px solid #444',
  color: '#fff',
  borderRadius: '4px',
  padding: '10px 0',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.2s'
};

const listContainer = {
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '1rem',
  maxHeight: '400px',
  overflowY: 'auto',
  marginBottom: '1rem'
};

const noteItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem',
  borderBottom: '1px solid #333',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const checkboxStyle = {
  marginRight: '1rem',
  width: '18px',
  height: '18px',
  pointerEvents: 'none'
};

const noteNameStyle = {
  flex: 1,
  color: '#fff',
  fontSize: '1rem'
};

const noteAuthorStyle = {
  color: '#888',
  fontSize: '0.8rem',
  marginRight: '1rem'
};

const publicBadge = {
  background: '#059669',
  color: '#fff',
  padding: '3px 8px',
  borderRadius: '50px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const privateBadge = {
  ...publicBadge,
  background: '#555',
};

const generateButton = {
  ...baseButtonStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
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

const flagButton = {
  ...baseButtonStyle,
  background: '#555',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const quizContainerStyle = {
  display: 'flex',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const questionAreaStyle = {
  flex: 1,
  textAlign: 'left'
};
// --- END OF STYLES ---


// --- Sidebar Component (Updated) ---
function QuizSidebar({ 
  total, 
  current, 
  answers, 
  flagged, 
  onNavClick,
  onExitClick // <-- NEW PROP
}) {
  return (
    <div style={sidebarStyle}>
      <h4 style={{textAlign: 'center', marginTop: 0}}>Questions</h4>
      <div style={paletteStyle}>
        {Array.from({ length: total }, (_, index) => {
          const isFlagged = flagged.includes(index);
          const isAnswered = answers[index] !== undefined;
          const isActive = index === current;
          
          let buttonStyle = {...paletteButtonStyle};
          if (isActive) {
            buttonStyle.background = COLORS.active;
            buttonStyle.borderColor = COLORS.active;
          } else if (isFlagged) {
            buttonStyle.background = COLORS.flagged;
            buttonStyle.color = '#000';
            buttonStyle.borderColor = COLORS.flagged;
          } else if (isAnswered) {
            buttonStyle.background = COLORS.answered; // <-- CHANGED TO GREEN
            buttonStyle.borderColor = '#155724';
          }

          return (
            <button 
              key={index} 
              style={buttonStyle}
              onClick={() => onNavClick(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      
      {/* --- NEW EXIT BUTTON --- */}
      <button 
        style={{...baseButtonStyle, background: '#b91c1c', width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}} 
        onClick={onExitClick}
      >
        <FiLogOut size={14} /> Exit Quiz
      </button>
      {/* --- END OF NEW BUTTON --- */}
    </div>
  );
}
// --- End of Sidebar ---


export default function ExamMode() {
  const [myNotes, setMyNotes] = useState([]);
  const [collabNotes, setCollabNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [flagged, setFlagged] = useState([]);

  // 1. Load ALL notes (private and public)
  useEffect(() => {
    const loadAllNotes = async () => {
      try {
        const [myNotesRes, collabRes] = await Promise.all([
          API.get('/notes/search'),
          API.get('/collaborate')
        ]);
        setMyNotes(myNotesRes.data);
        setCollabNotes(collabRes.data);
      } catch (err) {
        console.error("Failed to load notes:", err);
        toast.error("Could not load notes for Exam Mode.");
      }
    };
    loadAllNotes();
  }, []);

  const allNotes = useMemo(() => {
    const combined = [...myNotes, ...collabNotes];
    return Array.from(new Map(combined.map(note => [note.id, note])).values());
  }, [myNotes, collabNotes]);

  // --- 2. Utility Functions ---
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
    setSelectedNoteIds([]);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setFlagged([]);
  };
  
  const toggleNoteSelection = (id) => {
    setSelectedNoteIds(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(noteId => noteId !== id);
      } else {
        if (prev.length < 2) {
          return [...prev, id];
        } else {
          toast.error("You can only select a maximum of 2 notes.");
          return prev;
        }
      }
    });
  };

  // --- 3. Quiz Generation (File Selection) ---
  const generateQuiz = async () => {
    if (selectedNoteIds.length === 0) {
      return toast.error("Please select at least one note.");
    }
    
    setLoading(true);
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setFlagged([]);
    
    try {
      const selectedNotes = allNotes.filter(note => selectedNoteIds.includes(note.id));
      const topic = selectedNotes.map(n => n.fileName).join(', ');
      const quizResponse = await API.post('/gemini/generate-quiz', { topic });
      
      let quizData = quizResponse.data;
      if (quizData.quiz && Array.isArray(quizData.quiz)) {
        quizData = quizData.quiz; 
      } else if (!Array.isArray(quizData)) {
        throw new Error("AI returned an invalid quiz format. Please try again.");
      }
      
      setQuiz(quizData);
      toast.success("Quiz generated successfully!");
      
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Failed to generate quiz. Check console for details.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // --- 4. New Quiz Navigation Functions ---
  const submitAnswer = (optionIndex) => {
    if (!showResults) {
      setAnswers({ ...answers, [currentQuestion]: optionIndex });
    }
  };

  const handleToggleFlag = () => {
    setFlagged(prev => {
      if (prev.includes(currentQuestion)) {
        return prev.filter(index => index !== currentQuestion);
      } else {
        return [...prev, currentQuestion];
      }
    });
  };

  const handleNavClick = (index) => {
    setCurrentQuestion(index);
  };
  
  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your quiz?")) {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  // --- End of New Functions ---


  // --- 5. Render Views ---

  if (loading) {
    return <div style={{padding:'2rem'}}><h2>Processing Notes...</h2><p>The server is downloading and reading the text from your selected files.</p></div>;
  }
  
  if (showResults) {
    const score = scoreQuiz();
    const percent = Math.round((score / quiz.length) * 100);
    return (
      <div style={{padding:'2rem', maxWidth: 600, margin: 'auto', textAlign: 'center'}}>
        <h2 style={{color: COLORS.notes}}>Quiz Results!</h2>
        <p style={{fontSize: '1.5rem'}}>You scored {score} out of {quiz.length} ({percent}%)</p>
        <button style={baseButtonStyle} onClick={resetQuiz}>Start New Quiz</button>
      </div>
    );
  }

  // --- This is the new Quiz View with Sidebar ---
  if (quiz) {
    const q = quiz[currentQuestion];
    const isAnswered = answers[currentQuestion] !== undefined;
    const isLastQuestion = currentQuestion === quiz.length - 1;
    const isFlagged = flagged.includes(currentQuestion);
    
    // --- NEW: Check if all questions are answered ---
    const allAnswered = Object.keys(answers).length === quiz.length;

    return (
      <div style={quizContainerStyle}>
        {/* Main Question Area */}
        <div style={questionAreaStyle}>
          <h2 style={{color: COLORS.notes}}>Question {currentQuestion + 1} of {quiz.length}</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem', minHeight: '60px'}}>{q.question}</p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {q.options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => submitAnswer(index)} 
                style={{
                  ...optionButton,
                  border: answers[currentQuestion] === index ? `3px solid ${COLORS.active}` : '1px solid #333'
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
            {/* --- NEW PREV BUTTON --- */}
            <button 
              style={{...baseButtonStyle, background: '#555'}} 
              onClick={handlePrev}
              disabled={currentQuestion === 0}
            >
              <FiChevronLeft /> Previous
            </button>
            
            <button 
              style={{...flagButton, background: isFlagged ? COLORS.flagged : '#555', color: isFlagged ? '#000' : '#fff'}} 
              onClick={handleToggleFlag}
            >
              <FiFlag /> {isFlagged ? 'Flagged' : 'Flag'}
            </button>
            
            {/* --- NEW SUBMIT/NEXT LOGIC --- */}
            {isLastQuestion && allAnswered ? (
              <button 
                style={{...baseButtonStyle, background: '#198754'}} // Green submit
                onClick={handleSubmit} 
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                style={baseButtonStyle} 
                onClick={handleNext} 
                disabled={isLastQuestion || !isAnswered}
              >
                Next Question <FiChevronRight />
              </button>
            )}
            {/* --- END OF NEW LOGIC --- */}
          </div>
        </div>
        
        {/* Sidebar */}
        <QuizSidebar 
          total={quiz.length}
          current={currentQuestion}
          answers={answers}
          flagged={flagged}
          onNavClick={handleNavClick}
          onExitClick={resetQuiz} // <-- Pass the exit function
        />
      </div>
    );
  }

  // --- This is the file-selection view ---
  const atMaxSelection = selectedNoteIds.length >= 2;

  return (
    <div style={{padding:'2rem', maxWidth: 800, margin: 'auto', textAlign: 'left'}}>
      <h2 style={{color: COLORS.notes, textAlign: 'center'}}>AI Quiz Generator</h2>
      <p style={{color: '#aaa', marginBottom: '2rem', textAlign: 'center'}}>
        Select up to 2 notes from your repositories to generate a quiz.
      </p>

      <div style={listContainer}>
        {allNotes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No notes found. Upload or share notes to get started.</p>
        ) : (
          allNotes.map(n => {
            const isSelected = selectedNoteIds.includes(n.id);
            const isDisabled = atMaxSelection && !isSelected;
            return (
              <div 
                key={n.id} 
                style={{...noteItemStyle, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                onClick={() => !isDisabled && toggleNoteSelection(n.id)}
              >
                <input 
                  type="checkbox"
                  readOnly
                  checked={isSelected}
                  disabled={isDisabled}
                  style={checkboxStyle}
                />
                <span style={noteNameStyle}>{n.fileName}</span>
                <small style={noteAuthorStyle}>by: {n.userEmail || n.userid}</small>
                {myNotes.find(mn => mn.id === n.id) ? 
                  <span style={privateBadge}>Private</span> : 
                  <span style={publicBadge}>Public</span>
                }
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={generateQuiz} 
          style={{...generateButton, ...(selectedNoteIds.length === 0 && { opacity: 0.5, cursor: 'not-allowed' })}}
          disabled={selectedNoteIds.length === 0}
        >
          <FiSend style={{marginRight: '8px'}} /> Generate Quiz from {selectedNoteIds.length} Note(s)
        </button>
      </div>
    </div>
  );
}