// import express from "express";
// import { 
//   Job, 
//   Application, 
//   Contact, 
//   Query, 
//   Feedback, 
//   Content, 
//   Admin
// } from "../models/allmodels.js";

// import { auth } from "../middleware/auth.js";

// const router = express.Router();

// // ================= STATS API =================
// router.get("/stats", auth, async (req, res) => {
//   try {
//     const jobs = await Job.countDocuments();
//     const applications = await Application.countDocuments();
//     const contacts = await Contact.countDocuments();
//     const queries = await Query.countDocuments();
//     const feedbacks = await Feedback.countDocuments();
//     const contents = await Content.countDocuments();

//     res.json({
//       jobs,
//       applications,
//       contacts,
//       queries,
//       feedbacks,
//       contents,
//     });

//   } catch (err) {
//     console.error("Stats Error:", err);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// export default router;

import express from "express";
import { 
  Job, 
  Application, 
  Contact, 
  Query, 
  Feedback, 
  Content, 
  Admin,
  allApplication,
  ServiceRequest
} from "../models/allmodels.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// ================= STATS API =================
router.get("/stats", auth, async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const oldApplications = await Application.countDocuments();
    const newApplications = await allApplication.countDocuments();
    const contacts = await Contact.countDocuments();
    const queries = await Query.countDocuments();
    const feedbacks = await Feedback.countDocuments();
    const contents = await Content.countDocuments();
    const serviceRequests = await ServiceRequest.countDocuments();

    res.json({
      jobs,
      applications: oldApplications + newApplications + serviceRequests,
      oldApplications,
      newApplications,
      serviceRequests,
      contacts,
      queries,
      feedbacks,
      contents
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
