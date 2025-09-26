import { useEffect, useState } from 'react';
import API from '../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export default function Analytics() {
  const [data, setData] = useState({});
  useEffect(() => { API.get('/analytics/personal').then(r=>setData(r.data)); }, []);
  const pie = [{ name:'Notes', value:data.notes||0 }, { name:'Todos', value:data.todos||0 }];
  const COL = ['#667eea','#764ba2'];
  return (
    <div style={{padding:'2rem'}}>
      <h2>Analytics</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:30,marginTop:20}}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart><Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{pie.map((e,i)=><Cell key={`c-${i}`} fill={COL[i % COL.length]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <h3>Personal Stats</h3>
          <p>Total notes: <strong>{data.notes||0}</strong></p>
          <p>Total todos: <strong>{data.todos||0}</strong></p>
        </div>
      </div>
    </div>
  );
}