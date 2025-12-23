import express from "express";
import { createFeedback, getFeedback, deleteFeedback } from "../controller/allControllers.js";

const router = express.Router();

router.post("/post", createFeedback);
router.get("/get", getFeedback);
router.delete("/:id", deleteFeedback);


export default router;
