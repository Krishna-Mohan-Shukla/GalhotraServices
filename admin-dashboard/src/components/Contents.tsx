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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-indigo-800">
            Daily Content Manager
          </h2>
          <span className="text-gray-500 font-medium">
            Total: {contents.length}
          </span>
        </div>

        {/* FORM */}
        <div className="bg-indigo-50 rounded-3xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
            {editingId ? "Edit Content" : "Add New Content"}
          </h3>

          <div className="grid gap-5">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-indigo-200 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <textarea
              placeholder="Content text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="border border-indigo-200 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
              >
                {editingId ? "Update Content" : "Add Content"}
              </button>

              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT LIST */}
        {contents.length === 0 && (
          <div className="bg-white p-12 rounded-2xl text-center text-gray-400 shadow-lg">
            No daily content found
          </div>
        )}

        <div className="grid gap-6">
          {contents.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-indigo-900">
                  {c.title}
                </h4>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-indigo-700 whitespace-pre-line text-sm">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
