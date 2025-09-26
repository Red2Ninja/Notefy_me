import { useEffect, useState } from 'react';
import API from '../api';
import { FiDownload, FiEye } from 'react-icons/fi';

export default function Repository() {
  const [list, setList] = useState([]);
  const [course, setCourse] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => { fetchData(); }, [course, q]);
  const fetchData = async () => {
    const { data } = await API.get('/notes/search', { params: { course, q } });
    setList(data);
  };
  return (
    <div style={{padding:'2rem',display:'grid',gridTemplateColumns:'240px 1fr',gap:24}}>
      <aside>
        <input placeholder="Course code e.g. CS101" value={course} onChange={e=>setCourse(e.target.value)} style={{width:'100%',marginBottom:12}} />
        <input placeholder="Keyword…" value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%'}} />
      </aside>
      <main style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18}}>
        {list.map(n=>(
          <div key={n.id} style={card}>
            <h4>{n.fileName}</h4>
            <small>{n.courseCode} · {n.subject}</small>
            <div style={{marginTop:8,display:'flex',gap:8}}>
              <a href={`/note/${n.id}`} style={act}>View <FiEye/></a>
              <button style={act} onClick={()=>window.open(`${process.env.REACT_APP_API}/notes/${n.id}/download`,'_blank')}>Download <FiDownload/></button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
const card = { background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,padding:14 };
const act = { flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:4,background:'#f3f5f7',border:0,borderRadius:4,padding:'6px',cursor:'pointer' };