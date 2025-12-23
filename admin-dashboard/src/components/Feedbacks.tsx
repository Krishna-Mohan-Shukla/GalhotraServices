import React, { useState, useEffect, useCallback } from "react";

interface Feedback {
  _id: string;
  feedback: string;
}

interface FeedbacksProps {
  token: string;
}

export default function Feedbacks({ token }: FeedbacksProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [f, setF] = useState("");

  const API_BASE = "http://localhost:4000";

  // ✅ fetchFeedbacks wrapped in useCallback to fix ESLint warning
  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  }, [token]);

  // ✅ useEffect calls fetchFeedbacks safely
  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Add new feedback
  const addFeedback = async () => {
    if (!f.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback: f }),
      });

      if (res.ok) {
        setF("");
        fetchFeedbacks();
      }
    } catch (err) {
      console.error("Error adding feedback:", err);
    }
  };

  // Delete feedback
  const deleteFeedback = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedbacks();
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Feedbacks</h2>
          <p className="text-gray-500 mt-1">Manage user feedback & reviews</p>
        </div>

        {/* ADD FEEDBACK */}
        <div className="bg-white p-5 rounded-2xl shadow mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Add New Feedback
          </label>

          <div className="flex gap-3">
            <input
              placeholder="Write feedback..."
              value={f}
              onChange={(e) => setF(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addFeedback}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* FEEDBACK LIST */}
        <div className="space-y-4">
          {feedbacks.length === 0 && (
            <div className="bg-white p-8 text-center text-gray-500 rounded-xl shadow">
              No feedbacks found
            </div>
          )}

          {feedbacks.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <p className="text-gray-700">{item.feedback}</p>

                <button
                  onClick={() => deleteFeedback(item._id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
