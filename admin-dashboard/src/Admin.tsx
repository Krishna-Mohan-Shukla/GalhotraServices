

import React, { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Dashboard from "./components/Dashboard";
import Jobs from "./components/Jobs";
import Applications from "./components/Applications";
import NewApplications from "./components/NewApplications";
import ServiceRequests from "./components/ServiceRequests";
import Contacts from "./components/Contacts";
import Queries from "./components/Queries";
import Feedbacks from "./components/Feedbacks";
import Contents from "./components/Contents";
import "./index.css"

// ⭐ NEW IMPORT
// import CompanyApplications from "./components/CompanyApplications";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [route, setRoute] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    oldApplications: 0,
    newApplications: 0,
    serviceRequests: 0,
    contacts: 0,
    queries: 0,
    feedbacks: 0,
    contents: 0,
  });

  const API_BASE = "https://galhotrservice.com";

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/api/allData/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, [token]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setRoute("dashboard");
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setRoute("login");
  };

  if (!token) {
    return (
      <Login handleLogin={handleLogin} loading={loading} error={error} />
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1a202c", color: "white" }}>
      <Sidebar route={route} setRoute={setRoute} handleLogout={handleLogout} />

      <main style={{ flex: 1, padding: "20px" }}>

        {route === "dashboard" && <Dashboard stats={stats} />}
        {route === "jobs" && <Jobs token={token} />}

        {route === "applications_old" && <Applications token={token} />}
        {route === "applications_new" && <NewApplications token={token} />}
        {route === "service_requests" && <ServiceRequests token={token} />}

        {/* ⭐ NEW ROUTE */}
        {/* {route === "company_applications" && <CompanyApplications token={token} />} */}

        {route === "contacts" && <Contacts token={token} />}
        {route === "queries" && <Queries token={token} />}
        {route === "feedbacks" && <Feedbacks token={token} />}
        {route === "contents" && <Contents token={token} />}
      </main>
    </div>
  );
}
