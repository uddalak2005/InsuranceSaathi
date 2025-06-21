import express from "express";
import upload from "../middleware/upload.middleware.js"
import uploadController from "../controllers/upload.controller.js";
import verifyAuth from "../middleware/verifyAuth.middleware.js";

const router = express.Router();

router.post("/", verifyAuth, upload.single('file'), uploadController.uploadFile);

export default router;