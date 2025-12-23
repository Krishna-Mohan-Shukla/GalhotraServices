import express from "express";
import jwt from "jsonwebtoken";
import { Application } from "../models/allmodels.js";

const router = express.Router();

// Middleware: Verify company token
const verifyCompanyToken = (req, res, next) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const payload = jwt.verify(token, process.env.COMPANY_JWT_SECRET);
    req.payload = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired link" });
  }
};

// GET application details for company
router.get("/status-update/:token", verifyCompanyToken, async (req, res) => {
  const { applicationId } = req.payload;
  const app = await Application.findById(applicationId);
  if (!app) return res.status(404).json({ message: "Application not found" });

  res.json({
    success: true,
    name: app.name,
    email: app.email,
    phone: app.phone,
    jobTitle: app.jobTitle,
    resume: app.resume,
    status: app.status
  });
});

// PATCH update application status by company
router.patch("/status-update/:token", verifyCompanyToken, async (req, res) => {
  const { applicationId } = req.payload;
  const { status } = req.body;

  const validStatuses = [
    "Under Review",
    "Resume Selected",
    "Forwarded to HR",
    "Interview Scheduled",
    "Rejected",
    "Hired"
  ];

  if (!status || !validStatuses.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const app = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
  res.json({ success: true, message: "Status updated", application: app });
});

export default router;
