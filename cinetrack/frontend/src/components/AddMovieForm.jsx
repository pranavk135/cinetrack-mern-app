import React, { useState } from "react";
import { apiPost, apiGet } from "../utils/api";

export default function AddMovieForm({ token, refresh, lists }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [listName, setListName] = useState(lists?.[0] || "Default");

  // --- Search Movies from OMDb ---
  async function searchNow() {
    if (!q.trim()) return;
    try {
      const r = await apiGet(`/api/movies/search?q=${encodeURIComponent(q)}`, token);
      setResults(r.data || r);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed");
    }
  }

  // --- Add movie from search result ---
  async function addFromResult(item, list) {
    try {
      await apiPost("/api/movies", token, {
        title: item.title,
        year: item.year || 0,
        rating: 0,
        listName: list || "Default",
        apiId: item.apiId,
        poster: item.poster,
        type: item.type,
      });
      refresh();
    } catch (err) {
      console.error("Add from search failed:", err);
      alert("Add failed");
    }
  }

  // --- Add manually ---
  async function addManual() {
    if (!title.trim()) return alert("Enter title");
    try {
      await apiPost("/api/movies", token, {
        title,
        year: Number(year || 0),
        rating: Number(rating || 0),
        listName,
      });
      setTitle("");
      setYear("");
      setRating("");
      refresh();
    } catch (err) {
      console.error("Add manual failed:", err);
      alert("Add failed");
    }
  }

  return (
    <div className="card">
      <h3>Add or Search Movie</h3>

      {/* 🔍 Search Section */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search OMDb..."
        />
        <button className="btn" onClick={searchNow}>
          Search
        </button>
      </div>

      {/* Search Results */}
      <div style={{ marginTop: 8 }}>
        {results.map((r) => (
          <div
            key={r.apiId || r.title}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 8,
              borderBottom: "1px solid #333",
              paddingBottom: 8,
            }}
          >
            <img
              src={r.poster || "https://via.placeholder.com/80x120"}
              style={{ width: 60, height: 90, objectFit: "cover" }}
              alt="poster"
            />
            <div style={{ flex: 1 }}>
              <strong>{r.title}</strong>
              <div className="muted">{r.year}</div>
              <div style={{ marginTop: 6 }}>
                <select
                  defaultValue={listName}
                  onChange={(e) => setListName(e.target.value)}
                >
                  {lists.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <button
                  className="btn"
                  onClick={() => addFromResult(r, listName)}
                  style={{ marginLeft: 8 }}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* ✍️ Manual Add Section */}
      <h4>Manual Add</h4>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        type="number"
      />
      <input
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating (1-10)"
        type="number"
      />
      <select
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      >
        {lists.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button className="btn" onClick={addManual}>
        Add Manual
      </button>
    </div>
  );
}
