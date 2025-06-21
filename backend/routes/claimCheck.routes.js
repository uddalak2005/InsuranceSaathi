import express from "express";
import checkCoverageController from "../controllers/checkCoverage.controller.js";
import verifyAuth from "../middleware/verifyAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
    "/vehicleInsurance",
    verifyAuth,
    upload.fields([
        { name: "claimForm", maxCount: 1 },
        { name: "vehicleIdentity", maxCount: 5 },
        { name: "damageImage", maxCount: 5 },
        { name: "recipt", maxCount: 1 }
    ]),
    checkCoverageController.checkVehicleInsurance
);

router.post(
    "/lifeInsurance",
    verifyAuth,
    upload.fields([
        { name: "insuranceClaimForm", maxCount: 1 },
        { name: "policyDocument", maxCount: 1 },
        { name: "deathCert", maxCount: 1 },
        { name: "hospitalDocument", maxCount: 1 },
        { name: "fir", maxCount: 1 },
        { name: "passBook", maxCount: 1 }
    ]),
    checkCoverageController.checkLifeInsurance
);

router.post(
  "/healthInsurance",
  verifyAuth,
  upload.fields([
    { name: "policyDocs", maxCount: 1 },
    { name: "finalBill", maxCount: 1 },
    { name: "medicalDocs", maxCount: 1 }
  ]),
  checkCoverageController.checkHealthInsurance
);

router.get("/getAIScore/:id", verifyAuth, checkCoverageController.getScore);

router.get("/allClaimChecks", verifyAuth, checkCoverageController.getAllClaimCheckData);

router.get("/getClaim/:id", verifyAuth, checkCoverageController.getClaim);

export default router;