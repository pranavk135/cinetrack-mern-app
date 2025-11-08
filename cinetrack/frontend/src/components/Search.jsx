// frontend/src/components/Search.jsx
import React, { useState } from "react";
import { apiGet, apiPost } from "../utils/api";

export default function Search({ token, refresh, lists }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedList, setSelectedList] = useState(lists?.[0] || "Default");

  // --- Search Function ---
  async function handleSearch() {
    if (!query.trim()) return alert("Enter a search term");

    try {
      const data = await apiGet(`/api/movies/search?q=${encodeURIComponent(query)}`, token);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed — check backend or OMDb API key");
    }
  }

  // --- Add a Movie from Search ---
  async function handleAdd(movie) {
    try {
      await apiPost("/api/movies", token, {
        title: movie.title,
        year: movie.year,
        apiId: movie.apiId,
        poster: movie.poster,
        type: movie.type,
        listName: selectedList || "Default",
      });

      alert("Movie added!");
      refresh();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Add failed — check backend logs");
    }
  }

  return (
    <div className="card">
      <h3>Search Movies</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search OMDb..."
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        {results.length === 0 ? (
          <p className="muted">No results yet. Try searching something!</p>
        ) : (
          results.map((r) => (
            <div
              key={r.apiId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <img
                src={r.poster || "https://via.placeholder.com/80x120"}
                alt={r.title}
                style={{
                  width: 60,
                  height: 90,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{r.title}</strong>
                <div className="muted">{r.year}</div>
                <div style={{ marginTop: 6 }}>
                  <select
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                  >
                    {lists.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                  <button
                    className="btn"
                    onClick={() => handleAdd(r)}
                    style={{ marginLeft: 8 }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
