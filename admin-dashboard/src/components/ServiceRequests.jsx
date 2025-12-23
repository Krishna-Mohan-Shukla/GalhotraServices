
import React, { useEffect, useState } from "react";

export default function ServiceRequests({ token }) {
  const [requests, setRequests] = useState([]); // <- no type annotations

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/service/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/service/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      } else {
        alert("Delete Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Service Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-10">
          No service requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className={thStyle}>Name</th>
                <th className={thStyle}>Email</th>
                <th className={thStyle}>Phone</th>
                <th className={thStyle}>Service</th>
                <th className={thStyle}>Message</th>
                <th className={thStyle}>Date</th>
                <th className={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className={tdStyle}>{r.name}</td>
                  <td className={tdStyle}>{r.email}</td>
                  <td className={tdStyle}>{r.phone}</td>
                  <td className={tdStyle}>{r.service}</td>
                  <td className={tdStyle}>{r.message}</td>
                  <td className={tdStyle}>{new Date(r.createdAt).toLocaleString()}</td>
                  <td className={tdStyle}>
                    <button
                      onClick={() => deleteRequest(r._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = "px-4 py-3 text-left text-sm font-semibold";
const tdStyle = "px-4 py-3 text-sm text-gray-700";
