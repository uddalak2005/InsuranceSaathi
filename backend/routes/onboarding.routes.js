import express from "express";
import verifyAuth from "../middleware/verifyAuth.middleware.js";
import onboardingController from "../controllers/onboarding.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.patch("/policyHolder", verifyAuth, onboardingController.policyHolderOnboarding);
router.patch("/insurer", verifyAuth, upload.fields([
    { name: 'irdai', maxCount: 1 },
    { name: 'gst', maxCount: 1 }
]), onboardingController.insurerOnboarding);

export default router;