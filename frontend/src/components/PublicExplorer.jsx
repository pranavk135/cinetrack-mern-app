// frontend/src/pages/PublicExplorer.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/api";

export default function PublicExplorer() {
  const [lists, setLists] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){
    try {
      const res = await apiGet("/api/lists/public");
      setLists(res || []);
    } catch(e){ console.error(e); }
  }
  return (
    <div className="app">
      <h2>Public Explorer</h2>
      <div>
        {lists.map(l => (
          <div key={l._id} className="card" style={{marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3>{l.name}</h3>
              <div className="muted">{new Date(l.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="muted">Shows: {l.showPlanToWatch ? 'Plan ' : ''}{l.showWatching ? 'Watching ' : ''}{l.showCompleted ? 'Completed ' : ''}{l.showDropped ? 'Dropped' : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
