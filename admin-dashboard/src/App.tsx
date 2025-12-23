
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApp from "./Admin";
import CompanyApplications from "./components/CompanyApplications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC COMPANY LINK */}
        <Route
          path="/company/status-update/:token"
          element={<CompanyApplications />}
        />

        {/* 🔒 ADMIN APP */}
        <Route path="/*" element={<AdminApp />} />

      </Routes>
    </BrowserRouter>
  );
}
