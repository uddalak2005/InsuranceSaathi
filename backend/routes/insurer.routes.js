import express from "express";
import fetchClaimController from "../controllers/insurer.claimFetch.controller.js";
import riskEngineController from "../controllers/insurer.riskEngine.controller.js";
import verifyAuth from "../middleware/verifyAuth.middleware.js";
import claimDocs from "../controllers/insurer.claimDocs.controller.js";
import decisionController from "../controllers/insurer.decision.controller.js";


const router = express.Router()

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));

router.get("/getClaims", verifyAuth, fetchClaimController.fetchClaimsBasedOnIrdai);
router.get("/getClaim/:id", verifyAuth, fetchClaimController.fetchClaimData);

router.get("/getFraudReport/:id", verifyAuth, riskEngineController.fraudDetectionByAI);

router.get("/getClaimDocs/:id", verifyAuth, claimDocs.getClaimDocs);
router.get("/previewDoc/:id", claimDocs.previewDocument);
router.get("/downloadDoc/:id", claimDocs.downloadDocument);

router.post("/review/:id", verifyAuth, decisionController.setReview);
router.post("/approve/:id", verifyAuth, decisionController.setApprove);
router.post("/reject/:id", verifyAuth, decisionController.setReject);


export default router;