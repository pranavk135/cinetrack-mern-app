// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "../utils/api";
import AddMovieForm from "../components/AddMovieForm";

const token = localStorage.getItem("ct_token");
function Group({ title, items, token, refresh }) {
  return (
    <div className="group">
      <h4>
        {title} ({items.length})
      </h4>
      <div className="cards">
        {items.map((it) => (
          <div key={it._id} className="small-card">
            <img
              src={it.poster || "https://via.placeholder.com/120x170?text=No+Image"}
              alt={it.title}
            />
            <div style={{ flex: 1 }}>
              <strong>{it.title}</strong>
              <div className="muted">{it.type}</div>
              <div>Rating: {it.rating || "-"}</div>

              <div className="row" style={{ marginTop: "6px" }}>
                {/* --- STATUS SELECTOR --- */}
                <select
                  defaultValue={it.status || "Plan to Watch"}
                  onChange={async (e) => {
                    try {
                      await apiPut(`/api/movies/${it._id}`, token, {
                        status: e.target.value,
                      });
                      refresh();
                    } catch (err) {
                      console.error("Status update failed:", err);
                      alert("Failed to update status");
                    }
                  }}
                >
                  <option>Plan to Watch</option>
                  <option>Watching</option>
                  <option>Completed</option>
                  <option>Dropped</option>
                </select>

                {/* --- RATE BUTTON --- */}
                <button
                  className="btn tiny"
                  onClick={async () => {
                    const r = prompt("Set rating (0-10)", it.rating || 0);
                    const rv = Number(r);
                    if (!isNaN(rv)) {
                      await apiPut(`/api/movies/${it._id}`, token, { rating: rv });
                      refresh();
                    }
                  }}
                >
                  Rate
                </button>

                {/* --- DELETE BUTTON --- */}
                <button
                  className="btn danger tiny"
                  onClick={async () => {
                    if (window.confirm("Delete this item?")) {
                      await apiDelete(`/api/movies/${it._id}`, token);
                      refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              {/* --- REVIEW SECTION --- */}
              <div style={{ marginTop: "4px" }}>
                <em>{it.review}</em>
                <div>
                  <button
                    className="btn tiny"
                    onClick={async () => {
                      const review = prompt("Edit review", it.review || "");
                      if (review !== null) {
                        await apiPut(`/api/movies/${it._id}`, token, { review });
                        refresh();
                      }
                    }}
                  >
                    Edit review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ token: externalToken }) {
  const [movies, setMovies] = useState([]);
  const [lists, setLists] = useState(["Default"]);
  const token = externalToken || localStorage.getItem("ct_token");

  async function loadMovies() {
    try {
      const data = await apiGet("/api/movies", token);
      const validMovies = Array.isArray(data) ? data : [];

      setMovies(validMovies);
      const uniqueLists = [...new Set(validMovies.map((m) => m.listName || "Default"))];
      setLists(uniqueLists.length ? uniqueLists : ["Default"]);
    } catch (err) {
      console.error("Load movies failed:", err);
      alert("Failed to load movies — check backend connectivity");
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  // --- GROUP MOVIES BY STATUS ---
  const groups = {
    "Plan to Watch": [],
    Watching: [],
    Completed: [],
    Dropped: [],
  };

  movies.forEach((m) => {
    if (groups[m.status]) groups[m.status].push(m);
    else groups["Plan to Watch"].push(m); // default fallback
  });

  return (
    <div className="app">
      <h2 style={{ marginBottom: "10px" }}>🎞️ My Watchlists</h2>

      {/* --- ADD MOVIE FORM (Search + Manual) --- */}
      <AddMovieForm token={token} refresh={loadMovies} lists={lists} />

      {/* --- GROUPS BY STATUS --- */}
      {Object.keys(groups).map((k) => (
        <Group key={k} title={k} items={groups[k]} token={token} refresh={loadMovies} />
      ))}
    </div>
  );
}
