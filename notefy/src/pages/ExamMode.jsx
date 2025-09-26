import { useState } from 'react';
import API from '../api';
export default function ExamMode() {
  const [subject, setSubject] = useState('');
  const [pack, setPack] = useState(null);
  const compile = async () => {
    const { data } = await API.get(`/notes/search?subject=${subject}`);
    setPack(data);
  };
  return (
    <div style={{padding:'2rem'}}>
      <h2>Exam Prep Mode</h2>
      <div style={{display:'flex',gap:12,marginBottom:20}}>
        <input placeholder="Subject e.g. Linear Algebra" value={subject} onChange={e=>setSubject(e.target.value)} />
        <button onClick={compile}>Compile Exam Pack</button>
      </div>
      {pack && (
        <div>
          <h4>{pack.length} notes found</h4>
          <button onClick={()=>window.print()}>Print Pack</button>
          <ul>{pack.map(n=><li key={n.id}>{n.fileName}</li>)}</ul>
        </div>
      )}
    </div>
  );
}