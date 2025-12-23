import express from "express";
import {
  applyJob,
  getAllApplications,
  deleteAllApplication,
} from "../controller/allControllers.js";

const router = express.Router();

router.post("/apply", applyJob);
router.get("/get", getAllApplications);     // SAME ENDPOINT
router.delete("/apply/:id", deleteAllApplication); // FIXED TO MATCH FRONTEND

export default router;
