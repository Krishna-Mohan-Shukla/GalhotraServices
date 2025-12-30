import React, { useState, useEffect, useCallback } from "react";

interface Feedback {
  _id: string;
  feedback: string;
}

export default function Feedbacks({ token }: { token: string }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [input, setInput] = useState("");

  const API_BASE = "https://galhotrservice.com";

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback/get`);
      const data = await res.json();
      if (Array.isArray(data)) setFeedbacks(data);
    } catch (err) {
      console.error("Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const addFeedback = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/feedback/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: input }),
      });
      const data = await res.json();
      if (data && data._id) {
        setInput("");
        fetchFeedbacks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/feedback/${id}`, { method: "DELETE" });
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8ecff] to-[#ffe9f5] p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white shadow-2xl p-8 rounded-3xl">

        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          📢 User Feedbacks
        </h1>

        {/* ADD INPUT */}
        <div className="mb-8">
          <label className="font-medium text-gray-700 mb-1 block text-sm">
            Add Feedback Message
          </label>
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write something..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
            />
            <button
              onClick={addFeedback}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 && (
            <p className="p-8 bg-white rounded-xl shadow text-center text-gray-600">
              No feedbacks found 🥲
            </p>
          )}

          {feedbacks.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <p className="text-gray-700">{item.feedback}</p>
              <button
                onClick={() => deleteFeedback(item._id)}
                className="text-sm px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
