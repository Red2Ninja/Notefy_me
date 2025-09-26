import { useEffect, useState } from 'react';
import API from '../api';
export default function Tasks() {
  const [cols, setCols] = useState({ pending:[], progress:[], done:[] });
  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await API.get('/todos');
    setCols({
      pending: data.filter(t=>!t.completed),
      progress: [], // you can add a status field later
      done: data.filter(t=>t.completed)
    });
  };
  const add = async e => {
    e.preventDefault();
    const txt = e.target.task.value;
    await API.post('/todos', { task:txt });
    e.target.reset();
    load();
  };
  return (
    <div style={{padding:'2rem'}}>
      <h2>Tasks & Reminders</h2>
      <form onSubmit={add} style={{marginBottom:20}}>
        <input name="task" placeholder="New task…" required />
        <button>Add</button>
      </form>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
        {Object.entries(cols).map(([k,arr])=>(
          <div key={k} style={col}>
            <h4>{k}</h4>
            {arr.map(t=>(
              <div key={t.id} style={item}>{t.task}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
const col = { background:'#f9fafb',borderRadius:8,padding:12,minHeight:160 };
const item = { background:'#fff',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 12px',marginBottom:8 };