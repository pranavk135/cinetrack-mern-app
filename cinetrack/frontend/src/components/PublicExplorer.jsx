import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

export default function PublicExplorer() {
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadPublicLists();
  }, []);

  async function loadPublicLists() {
    try {
      const data = await apiGet('/api/lists/public');
      setLists(data || []);
    } catch (err) {
      console.error('Failed to load public lists:', err);
      alert('Failed to load public lists');
    }
  }

  const openList = (list) => {
    setSelected(list);
  };

  return (
    <div>
      <h2>Public Lists</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{minWidth:240}}>
          {lists.length === 0 ? (
            <div className="muted">No public lists yet</div>
          ) : (
            lists.map((list, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{
                  marginBottom:8, 
                  cursor:'pointer',
                  background: selected?.name === list.name ? '#2a2a2a' : '#1e1e1e'
                }} 
                onClick={() => openList(list)}
              >
                <strong>{list.name}</strong>
                <div className="muted">by {list.owner}</div>
                <div className="muted" style={{fontSize: '11px'}}>{list.movies.length} movies</div>
              </div>
            ))
          )}
        </div>
        <div style={{flex:1}}>
          {selected ? (
            <>
              <h3>{selected.name} — by {selected.owner}</h3>
              <div className="cards">
                {selected.movies.length === 0 ? (
                  <div className="muted">No movies in this list</div>
                ) : (
                  selected.movies.map(m => (
                    <div key={m._id} className="small-card">
                      <img src={m.poster||'https://via.placeholder.com/150x220'} alt={m.title}/>
                      <div>
                        <strong>{m.title}</strong>
                        <div className="muted">{m.type} • {m.year || ''}</div>
                        <div className="muted">Status: {m.status || 'Plan to Watch'}</div>
                        {m.rating ? <div className="muted">Rating: {m.rating}/10</div> : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="muted">Select a public list to view</div>
          )}
        </div>
      </div>
    </div>
  );
}
