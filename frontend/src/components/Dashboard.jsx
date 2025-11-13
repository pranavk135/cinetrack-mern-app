// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "../utils/api";
import AddMovieForm from "./AddMovieForm";

export default function Dashboard({ token }) {
  const [movies, setMovies] = useState([]);
  const [lists, setLists] = useState(["Default"]);

  async function load() {
    try {
      const data = await apiGet("/api/movies", token);
      setMovies(data);

      // Auto-extract unique list names
      const unique = [...new Set(data.map((m) => m.listName))];
      setLists(unique.length ? unique : ["Default"]);
    } catch (err) {
      console.error(err);
      alert("Failed to load movies");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Group by list
  const grouped = {};
  lists.forEach((l) => (grouped[l] = []));
  movies.forEach((m) => grouped[m.listName].push(m));

  return (
    <div className="page">
      <AddMovieForm token={token} lists={lists} onAdded={load} />

      {lists.map((list) => (
        <div key={list} style={{ marginBottom: 30 }}>
          <h2>{list}</h2>

          {grouped[list].length === 0 && (
            <div className="muted">No movies in this list</div>
          )}

          <div className="cards">
            {grouped[list].map((m) => (
              <div className="card small-card" key={m._id}>
                <img
                  src={
                    m.poster || "https://via.placeholder.com/120x170?text=No+Image"
                  }
                  alt="poster"
                />
                <div>
                  <strong>{m.title}</strong>
                  <div className="muted">{m.year}</div>

                  {/* Status Selection */}
                  <select
                    defaultValue={m.status}
                    onChange={async (e) => {
                      await apiPut(`/api/movies/${m._id}`, token, {
                        status: e.target.value,
                      });
                      load();
                    }}
                  >
                    <option>Plan to Watch</option>
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Dropped</option>
                  </select>

                  {/* Delete */}
                  <button
                    className="btn danger tiny"
                    onClick={async () => {
                      if (window.confirm("Delete this movie?")) {
                        await apiDelete(`/api/movies/${m._id}`, token);
                        load();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
