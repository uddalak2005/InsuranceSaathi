import express from "express";
import authController from "../controllers/auth.controller.js"
const router = express.Router();

router.post("/policyHolder/signUp", authController.PolicyHolderSignUp);
// router.post("/policyHolder/login", authController.login);
router.post("/insurer/signUp", authController.InsurerSignUp);
// router.post("/insurer/login", authController.login);
// router.post("/logout", authController.logout);

export default router;