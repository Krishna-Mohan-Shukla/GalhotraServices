
import React, { useState, useEffect } from "react";

interface Content {
  _id: string;
  title: string;
  text: string;
}

interface DailyContentAdminProps {
  token: string;
}

export default function DailyContentAdmin({ token }: DailyContentAdminProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_BASE = "https://galhotrservice.com/api/content";

  const fetchContents = async () => {
    const res = await fetch(`${API_BASE}/get`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContents(data);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleSubmit = async () => {
    if (!title || !text) return;

    const url = editingId
      ? `${API_BASE}/update/${editingId}`
      : `${API_BASE}/create`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, text }),
    });

    setTitle("");
    setText("");
    setEditingId(null);
    fetchContents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchContents();
  };

  const handleEdit = (content: Content) => {
    setTitle(content.title);
    setText(content.text);
    setEditingId(content._id);
  };

  const cancelEdit = () => {
    setTitle("");
    setText("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Daily Content Manager
          </h2>
          <span className="text-sm text-gray-500">
            Total: {contents.length}
          </span>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Content" : "Add New Content"}
          </h3>

          <div className="grid gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Content text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                {editingId ? "Update Content" : "Add Content"}
              </button>

              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT LIST */}
        {contents.length === 0 && (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow">
            No daily content found
          </div>
        )}

        <div className="grid gap-6">
          {contents.map((c) => (
            <div
              key={c._id}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  {c.title}
                </h4>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="bg-gray-50 border rounded-xl p-4 text-gray-700 whitespace-pre-line text-sm">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
