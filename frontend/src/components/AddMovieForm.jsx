// frontend/src/components/AddMovieForm.jsx
import React, { useState } from "react";
import { apiPost } from "../utils/api";

export default function AddMovieForm({ token, lists, onAdded }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [listName, setListName] = useState(lists[0] || "Default");
  const [newListName, setNewListName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  async function handleAdd() {
    if (!title.trim()) return alert("Enter title");

    let finalListName = listName;

    // If the user selects "Create New List"
    if (listName === "__new__") {
      if (!newListName.trim()) return alert("Enter new list name");
      finalListName = newListName;
    }

    try {
      await apiPost("/api/movies", token, {
        title,
        year: Number(year || 0),
        listName: finalListName,
        isPublic,
      });

      // Reset fields
      setTitle("");
      setYear("");
      setNewListName("");
      setListName(lists[0] || "Default");
      setIsPublic(false);

      onAdded && onAdded();
    } catch (err) {
      console.error("Add movie error:", err);
      alert("Add failed");
    }
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3>Add Movie</h3>

      {/* Title */}
      <input
        placeholder="Movie Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      {/* Year */}
      <input
        placeholder="Year"
        value={year}
        type="number"
        onChange={(e) => setYear(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      {/* Select List / Create List */}
      <select
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        style={{ marginBottom: 8 }}
      >
        {lists.map((l) => (
          <option key={l}>{l}</option>
        ))}
        <option value="__new__">➕ Create new list</option>
      </select>

      {/* New List Input */}
      {listName === "__new__" && (
        <input
          placeholder="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          style={{ marginBottom: 8 }}
        />
      )}

      {/* Public / Private Toggle */}
      <label style={{ marginBottom: 10, display: "block" }}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />{" "}
        Make list public
      </label>

      <button className="btn" onClick={handleAdd}>
        Add Movie
      </button>
    </div>
  );
}
