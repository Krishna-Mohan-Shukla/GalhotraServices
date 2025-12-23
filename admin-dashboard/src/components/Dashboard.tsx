
import React from "react";

interface DashboardProps {
  stats: Record<string, number>;
}

export default function Dashboard({ stats }: DashboardProps) {
  const labels: Record<string, string> = {
    jobs: "Total Jobs",
    applications: "Total Applications",
    oldApplications: "Old Applications",
    latestApplications: "New Applications",
    contacts: "Contacts",
    queries: "Queries",
    feedbacks: "Feedbacks",
    contents: "Content Entries",
  };

  const cardStyles: Record<string, string> = {
    jobs: "from-blue-500 to-blue-700",
    applications: "from-indigo-500 to-indigo-700",
    oldApplications: "from-gray-500 to-gray-700",
    latestApplications: "from-green-500 to-green-700",
    contacts: "from-yellow-500 to-yellow-700",
    queries: "from-purple-500 to-purple-700",
    feedbacks: "from-pink-500 to-pink-700",
    contents: "from-teal-500 to-teal-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            System summary & activity insights
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className={`relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br ${
                cardStyles[key] || "from-slate-600 to-slate-800"
              }`}
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-20 bg-white blur-2xl" />

              <div className="relative p-6 text-white">
                <p className="text-sm opacity-80">
                  {labels[key] || key}
                </p>

                <p className="text-4xl font-extrabold mt-2">
                  {value}
                </p>

                <div className="mt-4 h-1 w-12 bg-white/40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
