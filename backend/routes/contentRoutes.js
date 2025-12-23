// Daily Content Routes

import express from "express";
import { getContent, createContent, updateContent, deleteContent } from "../controller/allControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", getContent);
router.post("/create", auth, createContent);
router.put("/update/:id", auth, updateContent);
router.delete("/delete/:id", auth, deleteContent);

export default router;

