import { useState } from "react";

export default function AddListForm({ lists, setLists }) {
  const [name, setName] = useState("");

  const addList = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (lists.includes(trimmed)) return alert("List already exists");
    setLists([...lists, trimmed]);
    setName("");
  };

  return (
    <div className="add-form">
      <input
        type="text"
        placeholder="New list name (e.g., Favorites)"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button className="btn" onClick={addList}>Create List</button>
    </div>
  );
}
