import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ====== TYPE ======
interface Application {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  resume?: string;
  status: string;
}

export default function CompanyApplications() {
  const { token } = useParams<{ token: string }>();
  const BASE_URL = "http://localhost:4000/api/company/status-update";

  const [app, setApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    "Application Submitted",
    "Under Review",
    "Resume Selected",
    "Forwarded to HR",
    "Interview Scheduled",
    "Rejected",
    "Hired",
  ];

  // =============================
  // FETCH APPLICATION
  // =============================
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing link");
      setLoading(false);
      return;
    }

    const fetchApplication = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${token}`);
        if (!res.ok) throw new Error("Invalid or expired link");

        const data: Application = await res.json();
        setApp(data);
        setNewStatus(data.status);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [token]);

  // =============================
  // UPDATE STATUS
  // =============================
  const updateStatus = async () => {
    if (!newStatus || !token) return;

    try {
      setUpdating(true);
      const res = await fetch(`${BASE_URL}/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      setApp(data.application as Application);
      alert("Status updated successfully ✅");
    } catch {
      alert("Failed to update status ❌");
    } finally {
      setUpdating(false);
    }
  };

  // =============================
  // UI STATES
  // =============================
  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 font-medium">Loading...</p>
    );

  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-semibold">{error}</p>
    );

  if (!app)
    return <p className="p-6 text-center text-gray-600">No application found</p>;

  // =============================
  // MAIN UI
  // =============================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Candidate Application
        </h2>

        {/* Candidate Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Name:</strong> {app.name}
          </p>
          <p>
            <strong>Email:</strong> {app.email}
          </p>
          <p>
            <strong>Phone:</strong> {app.phone}
          </p>
          <p>
            <strong>Job Title:</strong> {app.jobTitle}
          </p>
        </div>

        {/* Resume */}
        {app.resume && (
          <a
            href={`http://localhost:4000/uploads/${app.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-600 font-medium underline"
          >
            📄 View Resume
          </a>
        )}

        {/* Current Status */}
        <div className="mt-5 p-3 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="text-lg font-semibold text-green-700">{app.status}</p>
        </div>

        {/* Update Status */}
        <div className="mt-6">
          <label className="block font-medium mb-1">Update Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={updateStatus}
            disabled={updating}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          This link is private & valid for a limited time
        </p>
      </div>
    </div>
  );
}
