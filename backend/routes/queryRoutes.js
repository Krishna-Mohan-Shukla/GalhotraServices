// Query Routes

import express from "express";
import { createQuery, getQueries, deleteQuery, resolveQuery} from "../controller/allControllers.js";

const router = express.Router();

router.post("/post", createQuery);
router.get("/get", getQueries);
router.delete("/:id", deleteQuery);
router.put("/resolve/:id", resolveQuery); 

export default router;