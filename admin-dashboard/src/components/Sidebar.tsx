import React from "react";

interface SidebarProps {
  route: string;
  setRoute: (r: string) => void;
  handleLogout: () => void;
}

export default function Sidebar({
  route,
  setRoute,
  handleLogout,
}: SidebarProps) {
  const routes = [
    { key: "dashboard", label: "Dashboard" },
    { key: "jobs", label: "Jobs" },
    { key: "applications_old", label: "Resume Applications" },
    { key: "applications_new", label: "Field Applications" },
    { key: "service_requests", label: "Service Requests" },
    { key: "contents", label: "Contents" },
    { key: "queries", label: "Queries" },
    { key: "feedbacks", label: "Feedbacks" },
    { key: "contacts", label: "Contacts" },
  ];

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #1a202c, #2d3748)",
        padding: "20px",
        boxShadow: "4px 0 12px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Admin Panel
      </h2>

      {routes.map((item) => {
        const isActive = route === item.key;

        return (
          <button
            key={item.key}
            onClick={() => setRoute(item.key)}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginBottom: "10px",
              padding: "12px 14px",
              background: isActive ? "#4c51bf" : "transparent",
              color: isActive ? "#fff" : "#e2e8f0",
              border: "none",
              borderRadius: "8px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: isActive ? "600" : "500",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.background = "#3c445c";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                e.currentTarget.style.background = "transparent";
            }}
          >
            {item.label}
          </button>
        );
      })}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          padding: "12px",
          width: "100%",
          borderRadius: "8px",
          background: "#e53e3e",
          color: "white",
          cursor: "pointer",
          border: "none",
          fontWeight: "600",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#c53030")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#e53e3e")
        }
      >
        Logout
      </button>
    </aside>
  );
}
