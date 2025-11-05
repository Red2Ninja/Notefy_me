// src/pages/Tasks.jsx
import { useEffect, useState, useMemo } from 'react';
import API from '../api.js';
import { FiTrash2, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await API.get('/todos');
      setTasks(data); // Load ALL tasks
    } catch (err) {
      console.error("Failed to load todos:", err);
    }
  };

  const startedTasks = useMemo(() => 
    tasks.filter(t => t.status === 'started' && !t.completed), [tasks]);
  const progressTasks = useMemo(() => 
    tasks.filter(t => t.status === 'progress' && !t.completed), [tasks]);
  const completedTasks = useMemo(() => 
    tasks.filter(t => t.completed), [tasks]);


  const add = async e => {
    e.preventDefault();
    if (!taskText.trim()) return;
    try {
      await API.post('/todos', { task: taskText, dueDate: dueDate });
      setTaskText('');
      setDueDate('');
      load();
      toast.success("Task added!");
    } catch (err) {
      console.error("Failed to add todo:", err);
      toast.error("Failed to add task.");
    }
  };

  const handleMove = async (id, newStatus, isCompleted) => {
    try {
      await API.patch(`/todos/${id}/move`, { newStatus, isCompleted });
      load(); 
    } catch (err) {
      console.error("Failed to move task:", err);
      toast.error("Failed to move task.");
    }
  };
  
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/todos/${id}`);
      load();
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Failed to delete todo:", err);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div style={tasksContainer}>
      <h2 style={{ marginBottom: '1.5rem' }}>Tasks</h2>
      
      <form onSubmit={add} style={formStyle}>
        <input 
          name="task" 
          placeholder="Task title" 
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          required 
          style={{...inputStyle, flex: 1}} 
        />
        <input 
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{...inputStyle, width: '150px'}} 
        />
        <button type="submit" style={buttonStyle}>Add</button>
      </form>
      
      <div style={kanbanBoard}>
        
        <TaskColumn 
          title="Started"
          tasks={startedTasks}
          onMove={(id) => handleMove(id, "progress", false)}
          actionIcon={<FiChevronRight />}
        />
        
        <TaskColumn 
          title="In Progress"
          tasks={progressTasks}
          onMove={(id) => handleMove(id, "completed", true)}
          actionIcon={<FiChevronRight />}
        />
        
        <TaskColumn 
          title="Completed"
          tasks={completedTasks}
          onMove={(id) => deleteTask(id)}
          actionIcon={<FiTrash2 />}
          actionStyle={deleteButton}
        />

      </div>
    </div>
  );
}

function TaskColumn({ title, tasks, onMove, actionIcon, actionStyle = moveButton }) {
  return (
    <div style={column}>
      <h3 style={columnTitle}>{title} ({tasks.length})</h3>
      <div style={listContainer}>
        {tasks.length === 0 && <p style={{color: '#888', fontSize: '0.9rem'}}>No tasks</p>}
        {tasks.map(t=>(
          <div key={t.id} style={taskItem}>
            <div style={taskDetails}>
              <span style={taskTextContent}>{t.task}</span>
              <small style={taskDate}>{t.dueDate || 'No due date'}</small>
            </div>
            <button onClick={() => onMove(t.id)} style={actionStyle}>
              {actionIcon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- STYLES ---

const tasksContainer = {
  maxWidth: '1000px',
  margin: '0 auto',
  // paddingTop: '2rem' <-- THIS WAS REMOVED
};

const formStyle = {
  marginBottom: '2rem',
  display: 'flex',
  gap: '1rem'
};

const inputStyle = {
  boxSizing: 'border-box',
  background: '#ffffff',
  border: '1px solid #333',
  color: '#000000',
  padding: '0.75rem',
  borderRadius: '4px'
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

const kanbanBoard = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem'
};

const column = {
  display: 'flex',
  flexDirection: 'column',
};

const columnTitle = {
  color: '#fff',
  borderBottom: '2px solid #333',
  paddingBottom: '0.5rem',
  marginBottom: '1rem',
  textAlign: 'left'
};

const listContainer = {
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '1rem',
  minHeight: '300px',
  flex: 1
};

const taskItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  borderBottom: '1px solid #333',
  gap: '0.5rem'
};

const taskDetails = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left'
};

const taskTextContent = {
  color: '#fff',
  fontSize: '1rem',
  wordBreak: 'break-word'
};

const taskDate = {
  color: '#888',
  fontSize: '0.8rem',
  marginTop: '0.25rem'
};

const moveButton = {
  background: '#3a3a3a',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '4px',
  padding: '0.5rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const deleteButton = {
  ...moveButton,
  background: '#b91c1c',
  border: 'none',
};