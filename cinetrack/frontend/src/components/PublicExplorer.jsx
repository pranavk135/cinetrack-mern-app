import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PublicExplorer() {
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(()=> {
    (async ()=>{
      const r = await axios.get('http://localhost:5000/api/lists/public/all');
      setLists(r.data);
    })();
  },[]);

  const openList = async (list) => {
    setSelected(list);
    const r = await axios.get(`http://localhost:5000/api/lists/public/${list.user._id}/${encodeURIComponent(list.name)}`);
    setMovies(r.data.movies);
  };

  return (
    <div>
      <h2>Public Lists</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{minWidth:240}}>
          {lists.map(l=>(
            <div key={l._id} className="card" style={{marginBottom:8, cursor:'pointer'}} onClick={()=>openList(l)}>
              <strong>{l.name}</strong>
              <div className="muted">{l.user?.username}</div>
            </div>
          ))}
        </div>
        <div style={{flex:1}}>
          {selected ? <>
            <h3>{selected.name} — by {selected.user?.username}</h3>
            <div className="cards">
              {movies.map(m=>(
                <div key={m._id} className="small-card">
                  <img src={m.poster||'https://via.placeholder.com/150x220'} alt={m.title}/>
                  <div>
                    <strong>{m.title}</strong>
                    <div className="muted">{m.status} • {m.rating ?? '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          </> : <div>Select a public list to view</div>}
        </div>
      </div>
    </div>
  );
}
