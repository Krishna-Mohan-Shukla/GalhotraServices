import { Job, Application, Contact, Query, Content, Feedback, Admin, allApplication, ServiceRequest } from "../models/allmodels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { sendCandidateEmail } from "../utils/mailer.js";
import { generateCompanyToken } from "../utils/generateCompanyToken.js";

dotenv.config();


// ---------------- JOBS ----------------
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// CREATE APPLICATION
export const createApplication = async (req) => {
  const { name, email, phone, jobTitle } = req.body;
  if (!name || !email || !phone || !jobTitle) throw new Error("All fields required");

  const existing = await Application.findOne({ email, jobTitle });
  if (existing) throw new Error("Already applied");

  const applicationId = "APP-" + Date.now();

  const app = await Application.create({
    name,
    email,
    phone,
    jobTitle,
    applicationId,
    status: "Application Submitted",
    resume: req.file ? req.file.filename : null
  });

  return app; // ✅ Return created application
};




export const notifyCompany = async (applicationId, companyEmail) => {
  const application = await Application.findById(applicationId);
  if (!application) return;

  const token = generateCompanyToken(applicationId, companyEmail);

  // const link = `${process.env.BASE_URL}/api/company/status-update/${token}`;
  const link = `${process.env.CLIENT_URL}/company/status-update/${token}`;


  await sendCandidateEmail({
    to: companyEmail,
    subject: `Candidate Application - ${application.name}`,
    html: `
      <h2>Candidate Application Details</h2>
      <p><strong>Name:</strong> ${application.name}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <p><strong>Job Title:</strong> ${application.jobTitle}</p>
      <p>📌 Update Status: <a href="${link}">Click here</a></p>
    `,
    attachmentPath: application.resume
      ? path.join(process.cwd(), "uploads/resumes", application.resume)
      : null,
    attachmentName: application.resume,
  });

  console.log("✅ Company mail sent:", link);
};






// GET ALL APPLICATIONS
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE APPLICATION
export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Delete resume file from uploads folder
    if (app.resume) {
      const filePath = path.join(process.cwd(), "uploads/resumes", app.resume);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    // Delete application from DB
    await Application.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Application and resume deleted" });
  } catch (err) {
    console.error("🔥 DELETE APPLICATION ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET STATUS BY APPLICATION ID
export const getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const app = await Application.findOne({ applicationId });
    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Invalid Application ID"
      });
    }

    res.json({
      success: true,
      name: app.name,
      appliedFor: app.jobTitle,
      status: app.status
    });

  } catch (err) {
    console.error("🔥 STATUS API ERROR:", err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
};


// UPDATE STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Application Submitted",
      "Under Review",
      "Resume Selected",
      "Forwarded to HR",
      "Interview Scheduled",
      "Rejected",
      "Hired"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Status updated", application: app });

  } catch (err) {
    console.error("🔥 UPDATE STATUS ERROR:", err.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// forwaord email


export const forwardApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyEmail } = req.body;

    if (!companyEmail)
      return res.status(400).json({ success: false, message: "Company email required" });

    const app = await Application.findById(id);
    if (!app)
      return res.status(404).json({ success: false, message: "Application not found" });

    const token = generateCompanyToken(app._id, companyEmail);
    const statusLink = `${process.env.BASE_URL}/company/status-update/${token}`;

    const html = `
      <h2>Candidate Application Details</h2>
      <p><strong>Name:</strong> ${app.name}</p>
      <p><strong>Email:</strong> ${app.email}</p>
      <p><strong>Phone:</strong> ${app.phone}</p>
      <p><strong>Job Title:</strong> ${app.jobTitle}</p>
      <p>Track/update status: <a href="${statusLink}">View Candidate Status</a></p>
    `;

    const attachmentPath = app.resume
      ? path.join(process.cwd(), "uploads/resumes", app.resume)
      : null;

    await sendCandidateEmail({
      to: companyEmail,
      subject: `Candidate Application - ${app.name}`,
      html,
      attachmentPath,
      attachmentName: app.resume,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("🔥 EMAIL ERROR:", err);
    res.status(500).json({ success: false, message: "Email failed" });
  }
};




// ---------------- CONTACT ----------------
export const createContact = async (req, res) => {
  try {
    const message = await Contact.create(req.body);
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const removed = await Contact.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- CONTENT ----------------
export const getContent = async (req, res) => {
  try {
    res.json(await Content.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createContent = async (req, res) => {
  try {
    res.json(await Content.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    res.json(await Content.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content removed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- QUERIES ----------------
export const createQuery = async (req, res) => {
  try {
    res.json(await Query.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getQueries = async (req, res) => {
  try {
    res.json(await Query.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Query
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findByIdAndDelete(id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Query status to solved
export const resolveQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findByIdAndUpdate(
      id,
      { status: "solved" },
      { new: true } // return the updated document
    );
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json({ message: "Query marked as solved", query });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// ---------------- FEEDBACK ----------------
export const createFeedback = async (req, res) => {
  try {
    res.json(await Feedback.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    res.json(await Feedback.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- ADMIN ----------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const applyJob = async (req, res) => {
  try {
    // Remove empty fields before saving
    const cleanData = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== "") cleanData[key] = req.body[key];
    });

    const app = await allApplication.create(cleanData);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL
export const getAllApplications = async (req, res) => {
  try {
    const apps = await allApplication.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE (FIXED)
export const deleteAllApplication = async (req, res) => {
  try {
    await allApplication.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const createServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin ke liye fetch all
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteService = async (req, res) => {
  try {
    const id = req.params.id;

    await ServiceRequest.findByIdAndDelete(id);

    res.json({ success: true, message: "Service request deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

