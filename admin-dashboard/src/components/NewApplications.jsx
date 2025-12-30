import React, { useEffect, useState, useCallback } from "react";
import { FiTrash2, FiMail, FiPhone } from "react-icons/fi";

export default function Applications({ token }) {
  const API = "https://galhotrservice.com/api/application";
  const [applications, setApplications] = useState([]);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`${API}/get`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();
      setApplications(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    }
  }, [token, API]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

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
    <div className="min-h-screen bg-[#0b132b] px-8 py-12 text-white">
      <h1 className="text-5xl font-extrabold mb-10">📨 Job Applications</h1>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((a) => (
          <div
            key={a._id}
            className="bg-[#1a2238] p-7 rounded-2xl shadow-xl border border-white/10 
                       hover:scale-[1.02] transition-all duration-300"
          >
            {/* Name & Contact */}
            <h2 className="text-3xl font-bold">{a.name}</h2>
            <p className="text-gray-300 mt-2 flex items-center gap-2 text-sm">
              <FiMail /> {a.email}
            </p>
            <p className="text-gray-300 flex items-center gap-2 mt-1 text-sm">
              <FiPhone /> {a.phone}
            </p>

            {/* Department Tag */}
            <p className="mt-4 inline-block px-3 py-1 text-sm bg-blue-600 rounded-full capitalize">
              {a.department}
            </p>

            {/* Dynamic Fields */}
            <div className="mt-5 space-y-1 text-gray-300 text-sm bg-black/20 rounded-lg p-4">
              {a.department === "it" && (
                <>
                  <p>🧑‍💻 Skill: <span className="text-white">{a.it_skill}</span></p>
                  <p>📅 Exp: <span className="text-white">{a.it_experience} yrs</span></p>
                </>
              )}

              {a.department === "hr" && (
                <>
                  <p>🧾 Speciality: <span className="text-white">{a.hr_speciality}</span></p>
                  <p>🛠 Tools: <span className="text-white">{a.hr_tools}</span></p>
                </>
              )}

              {a.department === "finance" && (
                <>
                  <p>💼 Role: <span className="text-white">{a.fin_role}</span></p>
                  <p>📅 Exp: <span className="text-white">{a.fin_exp} yrs</span></p>
                </>
              )}

              {a.department === "marketing" && (
                <>
                  <p>📢 Skills: <span className="text-white">{a.mkt_skill}</span></p>
                  <p>🌐 Platforms: <span className="text-white">{a.mkt_platform}</span></p>
                </>
              )}

              {a.department === "operations" && (
                <>
                  <p>⚙️ Skills: <span className="text-white">{a.op_skill}</span></p>
                  <p>📅 Exp: <span className="text-white">{a.op_exp} yrs</span></p>
                </>
              )}

              {a.department === "training" && (
                <>
                  <p>📚 Field: <span className="text-white">{a.train_field}</span></p>
                  <p>📅 Exp: <span className="text-white">{a.train_exp} yrs</span></p>
                </>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteApp(a._id)}
              className="mt-6 w-full bg-red-600/80 hover:bg-red-600 transition font-semibold px-4 py-2 rounded-xl"
            >
              🗑 Delete Application
            </button>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="mt-20 text-center text-gray-400 text-xl">
          🚫 No applications available
        </div>
      )}
    </div>
  );
}
