import express from "express";
import authController from "../controllers/auth.controller.js"

const router = express.Router();

// Add body parsers for this router
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));

router.post("/policyHolder/signUp", authController.PolicyHolderSignUp);
router.post("/insurer/signUp", authController.InsurerSignUp);
router.post("/policyHolder/login", authController.login);
router.post("/insurer/login", authController.login);
router.get("/logout", authController.logout);

export default router;
