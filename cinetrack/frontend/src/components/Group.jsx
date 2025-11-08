import React from 'react';
import { apiPut, apiDelete } from '../utils/api';

export default function Group({ title, items, token, refresh }) {
  return (
    <div className="group card">
      <h4>{title} ({items.length})</h4>
      <div className="cards">
        {items.map(it => (
          <div key={it._id} className="small-card">
            <img src={it.poster||'https://via.placeholder.com/150x220'} alt={it.title}/>
            <div style={{flex:1}}>
              <strong>{it.title}</strong>
              <div className="muted">{it.type} • {it.year || ''}</div>
              <div>Rating: {it.rating ?? '-'}/10</div>

              <div style={{display:'flex',gap:8,marginTop:8}}>
                <select defaultValue={it.status} onChange={async e=>{
                  await apiPut(`/api/movies/${it._id}`, token, { status: e.target.value });
                  refresh();
                }}>
                  <option>Plan to Watch</option>
                  <option>Watching</option>
                  <option>Completed</option>
                  <option>Dropped</option>
                </select>

                <button className="btn" onClick={async ()=>{
                  const r = prompt('Set rating 1-10', it.rating || 0);
                  if (r!==null) { await apiPut(`/api/movies/${it._id}`, token, { rating: Number(r) }); refresh(); }
                }}>Rate</button>

                <button className="btn" onClick={async ()=>{
                  const review = prompt('Edit review', it.review||'');
                  if (review!==null) { await apiPut(`/api/movies/${it._id}`, token, { review }); refresh(); }
                }}>Review</button>

                <button className="btn" style={{background:'#e53e3e'}} onClick={async ()=>{
                  if (confirm('Delete this movie?')) { await apiDelete(`/api/movies/${it._id}`, token); refresh(); }
                }}>Delete</button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
