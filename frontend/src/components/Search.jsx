import React, { useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
export default function Search({ token }){
  const [q,setQ]=useState(''); const [results,setResults]=useState([]); const [listName,setListName]=useState('Default');
  async function searchNow(){
    if(!q.trim()) return;
    try {
      const r = await apiGet(`/api/movies/search?q=${encodeURIComponent(q)}`);
      setResults(r || []);
    } catch(err){ console.error(err); alert('Search failed'); }
  }
  async function addFromResult(item){
    try {
      await apiPost('/api/movies', token, { title: item.title, year: Number(item.year||0), apiId: item.apiId, poster: item.poster, type: item.type, listName });
      alert('Added');
    } catch(err){ console.error(err); alert('Add failed'); }
  }
  return (
    <div className="page">
      <div className="card">
        <h3>Search OMDb</h3>
        <div style={{display:'flex',gap:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search movies..." />
          <button className="btn" onClick={searchNow}>Search</button>
        </div>
      </div>
      <div style={{marginTop:12}}>
        {results.length===0 ? <div className="muted">No results</div> :
          results.map(r=>(
            <div key={r.apiId || r.title} className="search-row">
              <img src={r.poster||'https://via.placeholder.com/80x120'} alt="" />
              <div style={{flex:1}}>
                <strong>{r.title}</strong>
                <div className="muted">{r.year}</div>
                <div style={{marginTop:8}}>
                  <input value={listName} onChange={e=>setListName(e.target.value)} placeholder="List name" />
                  <button className="btn" onClick={()=>addFromResult(r)} style={{marginLeft:8}}>+ Add</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
