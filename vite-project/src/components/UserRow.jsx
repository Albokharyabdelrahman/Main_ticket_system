// UserRow.jsx
import React, { useState } from "react";

const HIDDEN_FIELDS = ["__v", "createdAt", "updatedAt", "password"];

export default function UserRow({ user, onSave, onCancel, onDelete }) {
  const [editObj, setEditObj] = useState({ ...user });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (onSave) onSave(editObj);
      }}
      style={{ background: "#f8fafc", padding: 16, borderRadius: 6 }}
    >
      {Object.entries(editObj).map(([k, v]) => {
  if (HIDDEN_FIELDS.includes(k)) return null;
  if (k === "role") {
    return (
      <div key={k} style={{ marginBottom: 8 }}>
        <label style={{ color: "#64748b", textTransform: "capitalize", marginRight: 8 }}>
          Role
        </label>
        <select
          value={v}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 4,
            padding: 4,
            minWidth: 180,
          }}
          onChange={(e) =>
            setEditObj((obj) => ({ ...obj, [k]: e.target.value }))
          }
        >
          <option value="Admin">Admin</option>
          <option value="Organizer">Organizer</option>
          <option value="User">User</option>
        </select>
      </div>
    );
  } else {
    // Optionally, display fields like name/email as read-only text
    return (
      <div key={k} style={{ marginBottom: 8 }}>
        <label style={{ color: "#64748b", textTransform: "capitalize", marginRight: 8 }}>
          {k}
        </label>
        <span style={{ color: "#334155" }}>{v}</span>
      </div>
    );
  }
})}

      <button
        type="submit"
        style={{
          marginTop: 12,
          padding: "8px 16px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        style={{
          marginLeft: 12,
          padding: "8px 16px",
          background: "#64748b",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => onDelete && onDelete(editObj)}
        style={{
          marginLeft: 12,
          padding: "8px 16px",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </form>
  );
}