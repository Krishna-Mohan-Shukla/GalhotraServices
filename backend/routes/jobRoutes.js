// job 

import express, { application } from "express";
import { getJobs, createJob, updateJob, deleteJob } from "../controller/allControllers.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/get", getJobs);
router.post("/create", auth, createJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

export default router;