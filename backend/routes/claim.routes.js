import express from "express"
import claimController from "../controllers/claim.controller.js"
import verifyAuth from "../middleware/verifyAuth.middleware.js";
import upload from "../middleware/upload.middleware.js"

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
    claimController.claimVehicleInsurance
);

router.put("/vehicleInsurance/edit/:id", 
    verifyAuth,
    upload.fields([
        { name: "claimForm", maxCount: 1 },
        { name: "vehicleIdentity", maxCount: 5 },
        { name: "damageImage", maxCount: 5 },
        { name: "recipt", maxCount: 1 }
    ]),
    claimController.editVehicleInsurance
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
    claimController.claimLifeInsurance
);

router.put(
    "/lifeInsurance/edit/:id",
    verifyAuth,
    upload.fields([
        { name: "insuranceClaimForm", maxCount: 1 },
        { name: "policyDocument", maxCount: 1 },
        { name: "deathCert", maxCount: 1 },
        { name: "hospitalDocument", maxCount: 1 },
        { name: "fir", maxCount: 1 },
        { name: "passBook", maxCount: 1 }
    ]),
    claimController.editLifeInsurance
);

router.post(
  "/healthInsurance",
  verifyAuth,
  upload.fields([
    { name: "policyDocs", maxCount: 1 },
    { name: "finalBill", maxCount: 1 },
    { name: "medicalDocs", maxCount: 1 }
  ]),
  claimController.claimHealthInsurance
);

router.put(
  "/healthInsurance/edit/:id",
  verifyAuth,
  upload.fields([
    { name: "policyDocs", maxCount: 1 },
    { name: "finalBill", maxCount: 1 },
    { name: "medicalDocs", maxCount: 1 }
  ]),
  claimController.editHealthInsurance
);

router.post("/submit/:id", verifyAuth, claimController.submitInsurance);

router.get("/getAIScore/:id", verifyAuth, claimController.getScore);

router.get("/getAllClaims", verifyAuth, claimController.getAllClaimsByUser);

router.get("/getClaim/:id", verifyAuth, claimController.getClaim);


export default router;