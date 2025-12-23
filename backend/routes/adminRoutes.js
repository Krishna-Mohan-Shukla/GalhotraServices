// // Admin Routes

import express from "express";
import { adminLogin } from "../controller/allControllers.js";

const router = express.Router();

router.post("/login", adminLogin);

export default router;

