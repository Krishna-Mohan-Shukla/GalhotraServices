
// Contact Routes

import express from "express";
import { createContact, getContacts, deleteContact } from "../controller/allControllers.js";

const router = express.Router();

router.post("/create", createContact);
router.get("/get", getContacts);
router.delete("/:id", deleteContact);

export default router;