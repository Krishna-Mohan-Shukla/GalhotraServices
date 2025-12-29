import React, { useEffect, useState } from "react";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  resume: string;
  originalName: string;
  status: string;
}

interface Props {
  token: string;
}

export default function Applications({ token }: Props) {
  const API = "https://galhotrservice.com/api/apply";

  const [apps, setApps] = useState<Application[]>([]);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [companyEmails, setCompanyEmails] = useState<Record<string, string>>({});

  const statusOptions = [
    "Application Submitted",
    "Under Review",
    "Resume Selected",
    "Forwarded to HR",
    "Interview Scheduled",
    "Rejected",
    "Hired",
  ];

  const statusStyles: Record<string, string> = {
    "Application Submitted": "bg-gray-100 text-gray-700 border-gray-300",
    "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "Resume Selected": "bg-blue-100 text-blue-800 border-blue-300",
    "Forwarded to HR": "bg-purple-100 text-purple-800 border-purple-300",
    "Interview Scheduled": "bg-indigo-100 text-indigo-800 border-indigo-300",
    "Rejected": "bg-red-100 text-red-800 border-red-300",
    "Hired": "bg-green-100 text-green-800 border-green-300",
  };

  useEffect(() => {
    fetch(`${API}/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setApps(Array.isArray(data) ? data : data.applications || [])
      );
  }, []);

  const updateStatus = async (id: string) => {
    await fetch(`${API}/status/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    setApps((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );

    setEditingStatusId(null);
  };

  const deleteApplication = async (id: string) => {
    await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setApps((prev) => prev.filter((a) => a._id !== id));
  };

  const sendToCompany = async (id: string, email?: string) => {
    if (!email) return alert("Enter company email");
    await fetch(`${API}/forward/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ companyEmail: email }),
    });
    alert("Application sent");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Applications
        </h2>

        {apps.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
            No applications found
          </div>
        )}


        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl p-6 mb-6 border shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-500">{app.jobTitle}</p>
              </div>

              <span
                className={`px-4 py-1.5 text-xs font-medium border rounded-full whitespace-nowrap ${statusStyles[app.status] || "bg-gray-100 text-gray-700"
                  }`}
              >
                {app.resume && (
                  <a
                    href={`https://galhotrservice.com/uploads/resumes/${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 text-blue-600 font-medium underline"
                  >
                    📄 View Resume
                  </a>
                )}

                {app.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{app.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{app.phone}</p>
              </div>
            </div>

            {/* STATUS ACTION */}
            <div className="flex flex-wrap gap-3 items-center mb-5">
              {editingStatusId === app._id ? (
                <>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateStatus(app._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingStatusId(app._id);
                    setNewStatus(app.status);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  Change Status
                </button>
              )}
            </div>

            {/* FORWARD */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Forward to Company
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="company@email.com"
                  className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={companyEmails[app._id] || ""}
                  onChange={(e) =>
                    setCompanyEmails((p) => ({
                      ...p,
                      [app._id]: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={() =>
                    sendToCompany(app._id, companyEmails[app._id])
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                >
                  Send
                </button>
              </div>
            </div>

            {/* DELETE */}
            <div className="mt-4 text-right">
              <button
                onClick={() => deleteApplication(app._id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Delete Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
