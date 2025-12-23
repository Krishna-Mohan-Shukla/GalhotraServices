// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { createApplication, getApplications, deleteApplication, notifyCompany, updateApplicationStatus  } from "../controller/allControllers.js";
// import { Application } from "../models/allmodels.js";



// const router = express.Router();

// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/resumes");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   },
// });

// const upload = multer({ storage });

// // ------------------- ROUTES -------------------
// // Create application with resume upload
// router.post("/post", upload.single("resume"), createApplication);

// // Get all applications
// router.get("/get", getApplications);

// // Delete application by ID
// router.delete("/delete/:id", deleteApplication);


// // PATCH /api/apply/status/:id
// router.patch("/status/:id", updateApplicationStatus);

// // Resume download (supports PDF, DOC, DOCX)
// router.get("/resume/:filename", (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(process.cwd(), "uploads/resumes", filename);
  
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("Resume not found");
//   }
  
//   const ext = path.extname(filename).toLowerCase();
//   let contentType = "application/octet-stream";

//   if (ext === ".pdf") contentType = "application/pdf";
//   else if (ext === ".doc") contentType = "application/msword";
//   else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

//   res.setHeader("Content-Type", contentType);
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

//   fs.createReadStream(filePath).pipe(res);
// });

// router.get("/status/:id", async (req, res) => {
//   try {
//     const app = await Application.findOne({ applicationId: req.params.id });
//     // ← use req.params.id


//     if (!app) {
//       return res.status(404).json({ success: false, message: "Invalid Application ID" });
//     }

//     res.json({
//       success: true,
//       name: app.name,
//       appliedFor: app.jobTitle,
//       status: app.status
//     });

//   } catch (err) {
//     console.error(err); // always log the error
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });




// export default router;



// routes/applicationRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createApplication, getApplications, deleteApplication, updateApplicationStatus,  forwardApplication} from "../controller/allControllers.js";
import { notifyCompany } from "../controller/allControllers.js"; // Ye function company ko notify karega
import { Application } from "../models/allmodels.js";

const router = express.Router();

// ------------------- MULTER STORAGE -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ------------------- ROUTES -------------------

// 1️⃣ Create application + upload resume + notify company
router.post("/post", upload.single("resume"), async (req, res) => {
  try {
    const application = await createApplication(req);
    const companyEmail = req.body.companyEmail;
    if (companyEmail) await notifyCompany(application._id, companyEmail);
    res.status(201).json({ success: true, applicationId: application._id });
  } catch (err) {
    console.error("🔥 CREATE APPLICATION ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post("/forward/:id", forwardApplication); 


// 2️⃣ Get all applications
router.get("/get", getApplications);

// 3️⃣ Delete application
router.delete("/delete/:id", deleteApplication);

// 4️⃣ Update application status (Admin)
router.patch("/status/:id", updateApplicationStatus);

// 5️⃣ Download resume
router.get("/resume/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), "uploads/resumes", filename);

  if (!fs.existsSync(filePath)) return res.status(404).send("Resume not found");

  const ext = path.extname(filename).toLowerCase();
  let contentType = "application/octet-stream";

  if (ext === ".pdf") contentType = "application/pdf";
  else if (ext === ".doc") contentType = "application/msword";
  else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  fs.createReadStream(filePath).pipe(res);
});

// 6️⃣ Get application status (for company via secure token link)
router.get("/status/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ success: false, message: "Invalid Application ID" });

    res.json({
      success: true,
      name: app.name,
      appliedFor: app.jobTitle,
      status: app.status,
      resume: app.resume
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// router.post("/forward/:id", async (req, res) => {
//   try {
//     const { companyEmail } = req.body;
//     const app = await Application.findById(req.params.id);

//     if (!app) return res.status(404).json({ success: false, message: "Application not found" });

//     await notifyCompany(app._id, companyEmail);

//     res.json({ success: true, message: "Application sent to company" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });



export default router;


// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import {
//   createApplication,
//   getApplications,
//   deleteApplication,
//   updateApplicationStatus,
//   forwardApplication,
//   notifyCompany
// } from "../controller/allControllers.js";
// import { Application } from "../models/allmodels.js";

// const router = express.Router();

// // Multer storage for resumes
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/resumes"),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   }
// });
// const upload = multer({ storage });

// // ------------------- ADMIN ROUTES -------------------

// // 1️⃣ Create application + notify company
// router.post("/post", upload.single("resume"), async (req, res) => {
//   try {
//     const application = await createApplication(req);
//     const companyEmail = req.body.companyEmail;
//     if (companyEmail) await notifyCompany(application._id, companyEmail);
//     res.status(201).json({ success: true, applicationId: application._id });
//   } catch (err) {
//     console.error("🔥 CREATE APPLICATION ERROR:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // 2️⃣ Forward application to company (send email)
// router.post("/forward/:id", forwardApplication);

// // 3️⃣ Get all applications
// router.get("/get", getApplications);

// // 4️⃣ Delete application
// router.delete("/delete/:id", deleteApplication);

// // 5️⃣ Update application status (Admin)
// router.patch("/status/:id", updateApplicationStatus);

// // 6️⃣ Download resume
// router.get("/resume/:filename", (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(process.cwd(), "uploads/resumes", filename);

//   if (!fs.existsSync(filePath)) return res.status(404).send("Resume not found");

//   const ext = path.extname(filename).toLowerCase();
//   let contentType = "application/octet-stream";
//   if (ext === ".pdf") contentType = "application/pdf";
//   else if (ext === ".doc") contentType = "application/msword";
//   else if (ext === ".docx")
//     contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

//   res.setHeader("Content-Type", contentType);
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//   fs.createReadStream(filePath).pipe(res);
// });

// export default router;
