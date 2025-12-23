import mongoose from "mongoose";

// Job Model
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  posted: { type: String, default: new Date().toISOString() },
});
export const Job = mongoose.model("Job", jobSchema);

// Application Model
const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  jobTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: String, required: true },
  status: {
    type: String,
    default: "Application Submitted",
    enum: [
      "Application Submitted",
      "Under Review",
      "Resume Selected",
      "Forwarded to HR",
      "Interview Scheduled",
      "Rejected",
      "Hired"
    ]
  },
  createdAt: { type: Date, default: Date.now }
});

export const Application = mongoose.model("Application", applicationSchema);


// Contact Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});
export const Contact = mongoose.model("Contact", contactSchema);


const querySchema = new mongoose.Schema({
  query: { type: String, required: true },
  status: { type: String, enum: ["pending", "solved"], default: "pending" },
});

export const Query = mongoose.model("Query", querySchema);


// Content Model (Daily Content)
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
});
export const Content = mongoose.model("Content", contentSchema);

// Feedback Model
const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
});
export const Feedback = mongoose.model("Feedback", feedbackSchema);

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
});
export const Admin = mongoose.model("Admin", adminSchema);


const allApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    department: { type: String, required: true },  // it, hr, finance etc.

    // IT Department Fields
    it_skill: { type: String },
    it_experience: { type: String },

    // HR Department Fields
    hr_speciality: { type: String },
    hr_tools: { type: String },

    // Finance Department
    fin_role: { type: String },
    fin_exp: { type: String },

    // Marketing Department
    mkt_skill: { type: String },
    mkt_platform: { type: String },

    // Operations Department
    op_skill: { type: String },
    op_exp: { type: String },

    // Training Department
    train_field: { type: String },
    train_exp: { type: String }
  },
  { timestamps: true }
);
 
export const allApplication = mongoose.model("allApplication", allApplicationSchema);


const serviceRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);