import React, { useEffect, useState, useCallback } from "react";
import { FiTrash2, FiMail, FiPhone } from "react-icons/fi";

export default function Applications({ token }) {
  const API = "https://galhotrservice.com/api/application";
  const [applications, setApplications] = useState([]);

  // ✅ fetchApps wrapped in useCallback to fix ESLint warning
  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`${API}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  }, [token, API]);

  // ✅ useEffect calls fetchApps safely
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Delete app
  const deleteApp = async (id) => {
    try {
      await fetch(`${API}/apply/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApps();
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b132b] to-[#1c2541] px-6 py-10 text-white">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          New Applications
        </h1>
        <p className="text-gray-300 mt-2 text-lg">
          Recently submitted candidate profiles
        </p>
      </div>

      {/* GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((a) => (
          <div
            key={a._id}
            className="relative bg-white/10 backdrop-blur-xl border border-white/10 
                       rounded-2xl p-6 shadow-lg hover:shadow-2xl transition 
                       hover:-translate-y-1"
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-semibold">{a.name}</h3>
                <div className="mt-2 space-y-1 text-gray-300 text-sm">
                  <p className="flex items-center gap-2">
                    <FiMail /> {a.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone /> {a.phone}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-lg text-sm font-medium 
                               bg-blue-500/20 border border-blue-400/30 
                               text-blue-300 capitalize">
                {a.department || "General"}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => deleteApp(a._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-red-500/20 border border-red-400/30 text-red-300
                           hover:bg-red-600 hover:text-white transition"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {applications.length === 0 && (
        <div className="mt-24 text-center text-gray-400 text-xl">
          No applications found 🚫
        </div>
      )}
    </div>
  );
}
