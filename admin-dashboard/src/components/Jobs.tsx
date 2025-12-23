
import React, { useState, useEffect } from "react";

interface Job {
  _id: string;
  title: string;
  location: string;
  vacancy: number;
  description?: string;
  posted?: string;
}

interface JobsProps {
  token: string;
}

export default function Jobs({ token }: JobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [vacancy, setVacancy] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [posted, setPosted] = useState("");

  const API_BASE = "http://localhost:4000";

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const createJob = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          location,
          vacancy,
          description,
          posted,
        }),
      });

      if (res.ok) {
        setTitle("");
        setLocation("");
        setVacancy(1);
        setDescription("");
        setPosted("");
        fetchJobs();
      }
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Jobs</h2>
          <p className="text-gray-500">Create and manage job postings</p>
        </div>

        {/* CREATE JOB */}
        <div className="bg-white p-6 rounded-2xl shadow mb-10">
          <h3 className="text-lg font-semibold mb-4">Add New Job</h3>

          <div className="grid gap-4 md:grid-cols-6">
            <input
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-xl px-4 py-2 md:col-span-2 text-gray-800"
            />

            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-xl px-4 py-2 md:col-span-1 text-gray-800"
            />

            <input
              type="number"
              min={1}
              value={vacancy}
              onChange={(e) => setVacancy(Number(e.target.value))}
              className="border rounded-xl px-4 py-2 md:col-span-1 text-gray-800"
            />

            <input
              placeholder="Posted (e.g. Today / 12 Aug)"
              value={posted}
              onChange={(e) => setPosted(e.target.value)}
              className="border rounded-xl px-4 py-2 md:col-span-1 text-gray-800"
            />

            <button
              onClick={createJob}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 md:col-span-1 transition"
            >
              Add Job
            </button>

            <textarea
              placeholder="Job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-xl px-4 py-2 md:col-span-6 h-24 text-gray-800"
            />
          </div>
        </div>

        {/* JOB LIST */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-xl text-center text-gray-500 shadow">
              No jobs posted yet
            </div>
          )}

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {job.title}
              </h3>

              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>📍 {job.location || "N/A"}</p>
                <p>👥 Vacancies: {job.vacancy}</p>
                {job.posted && <p>🕒 Posted: {job.posted}</p>}
              </div>

              {job.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {job.description}
                </p>
              )}

              <button
                onClick={() => deleteJob(job._id)}
                className="mt-5 w-full bg-red-600 hover:bg-red-700 text-gray-800 py-2 rounded-xl transition"
              >
                Delete Job
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
