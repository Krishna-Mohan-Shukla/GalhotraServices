
import React, { useEffect, useState } from "react";

interface Query {
  _id: string;
  query: string;
  status: "pending" | "solved";
}

interface QueriesProps {
  token: string;
}

export default function Queries({ token }: QueriesProps) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [q, setQ] = useState("");

  const API_BASE = "https://galhotrservice.com";

  const fetchQueries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/query/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setQueries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [token]);

  const addQuery = async () => {
    if (!q) return;
    try {
      const res = await fetch(`${API_BASE}/api/query/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: q }),
      });
      if (res.ok) {
        setQ("");
        fetchQueries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuery = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/query/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  const markAsSolved = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/query/resolve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Queries</h2>

      {/* Add Query */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Add a new query..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addQuery}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {queries.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No queries available.
          </p>
        )}

        {queries.map((query) => (
          <div
            key={query._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <div>
              <p className="text-gray-800 font-medium">{query.query}</p>
              <span
                className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  query.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {query.status.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              {query.status === "pending" && (
                <button
                  onClick={() => markAsSolved(query._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition text-sm"
                >
                  Solve
                </button>
              )}
              <button
                onClick={() => deleteQuery(query._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
