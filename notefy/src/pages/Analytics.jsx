// src/pages/Analytics.jsx
import { useEffect, useState } from 'react';
import API from '../api.js';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Define new colors for the chart
const COLORS = {
  notes: '#6e48ff',
  started: '#ffc107',
  progress: '#0dcaf0',
  completed: '#198754',
};

// Custom label component
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  if (value === 0) return null; 
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="0.9rem"
    >
      {`${name} (${value})`}
    </text>
  );
};

export default function Analytics() {
  const [data, setData] = useState({ notes: 0, todos: { started: 0, progress: 0, completed: 0 } });

  useEffect(() => { 
    API.get('/analytics/personal')
      .then(r => setData(r.data))
      .catch(err => console.error("Failed to load analytics", err));
  }, []);

  const pieData = [
    { name: 'Notes', key: 'notes', value: data.notes || 0 },
    { name: 'Tasks (Started)', key: 'started', value: data.todos.started || 0 },
    { name: 'Tasks (In Progress)', key: 'progress', value: data.todos.progress || 0 },
    { name: 'Tasks (Completed)', key: 'completed', value: data.todos.completed || 0 },
  ];
  
  const activePieData = pieData.filter(entry => entry.value > 0);

  return (
    // The main div no longer has padding or a title
    <div> 
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        marginTop: '1rem', // Reduced margin
        alignItems: 'center'
      }}>
        
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={activePieData}
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={90}
              fill="#8884d8"
              labelLine={true}
              label={renderCustomizedLabel}
            >
              {activePieData.map((entry) => (
                <Cell 
                  key={`cell-${entry.key}`} 
                  fill={COLORS[entry.key]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Personal Stats */}
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center', textAlign: 'left', gap: '1rem'}}>
          <h3 style={{marginTop: 0}}>Personal Stats</h3>
          <p style={statLine}>
            <span style={{...dot, background: COLORS.notes}}></span>
            Total Notes: <strong>{data.notes || 0}</strong>
          </p>
          <p style={statLine}>
            <span style={{...dot, background: COLORS.started}}></span>
            Tasks Started: <strong>{data.todos.started || 0}</strong>
          </p>
          <p style={statLine}>
            <span style={{...dot, background: COLORS.progress}}></span>
            Tasks In Progress: 
            <strong>{data.todos.progress || 0}</strong>
          </p>
          <p style={statLine}>
            <span style={{...dot, background: COLORS.completed}}></span>
            Tasks Completed: <strong>{data.todos.completed || 0}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const statLine = {
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  fontSize: '1.1rem'
};

const dot = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  marginRight: '12px',
  display: 'inline-block'
};  