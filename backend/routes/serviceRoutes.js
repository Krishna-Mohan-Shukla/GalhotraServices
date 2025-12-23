import express from "express";
import {
  createServiceRequest,
  getAllServiceRequests,deleteService
} from "../controller/allControllers.js";

const router = express.Router();

router.post("/create", createServiceRequest);       // user submit form
router.get("/get", getAllServiceRequests);       // admin view all
router.delete("/delete/:id",deleteService)

export default router;
