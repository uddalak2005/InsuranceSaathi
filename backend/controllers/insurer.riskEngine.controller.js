import getAIInsights from "../services/getAIInsights.service.js";
import Claim from "../models/claim.model.js";
import VehicleInsurance from "../models/vehicleInsurance.model.js";
import LifeInsurance from "../models/lifeInsurance.model.js";
import HealthInsurance from "../models/healthInsurance.model.js";

class RiskEngineController {

    async evaluateRiskByAI(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "No Claims Found" });
            }

            const insuranceId = claimRecord.policyId;
            const insuranceModel = claimRecord.policyModel;

            let Model;
            let populateFields = [];

            switch (insuranceModel) {

                case (VehicleInsurance):
                    Model = VehicleInsurance;
                    populateFields = ['claimForm', 'vehicleIdentity', 'damageImage', 'recipt']
                    break;

                case (LifeInsurance):
                    Model = LifeInsurance;
                    populateFields = [
                        'insuranceClaimForm',
                        'nominee.passBook',
                        'policyDocument',
                        'deathCert',
                        'hospitalDocument',
                        'fir'
                    ];
                    break;

                case (HealthInsurance):
                    Model = HealthInsurance;
                    populateFields = ['policyDocs', 'finalBill', 'passbook'];
                    break;
                
                default :
                    throw new Error("Unknown Policy")
            }
            


            const query = await Model.findById(insuranceId);

            for(const field of populateFields){
                query = query.populate(field);
            }

            const insuranceDoc = await query;

            if (!insuranceDoc) {
                return res.status(404).json({ message: "Policy Not found" });
            }

            const insuranceRecord = {
                ...insuranceDoc.toObject(),
                policyModel: insuranceModel
            }

            const responseFromAi = await getAIInsights.evaluateRisk(insuranceRecord);

            if (!responseFromAi) {
                return res.status(404).json({ message: "Failed to fetch Ai predictions" });
            }

            claimRecord.aiScore = responseFromAi.aiScore;
            claimRecord.aiConfidence = responseFromAi.aiConfidence;
            claimRecord.riskFactors = responseFromAi.riskFactors;
            claimRecord.aiSuggestions = responseFromAi.aiSuggestions;

            await claimRecord.save();

            return res.status(200).json({ responseFromAi });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "AI Evaluation is not working now",
                error: err.message
            })
        }
    }


    async fraudDetectionByAI(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);
            if (!claimRecord) {
                return res.status(404).json({ message: "No claim found with that ID" });
            }

            const { policyId, policyModel } = claimRecord;

            let Model;
            let populateFields = [];

            switch (policyModel) {

                case "VehicleInsurance":
                    Model = VehicleInsurance;
                    populateFields = ['claimForm', 'vehicleIdentity', 'damageImage', 'recipt'];
                    break;

                case "LifeInsurance":
                    Model = LifeInsurance;
                    populateFields = [
                        'insuranceClaimForm',
                        'nominee.passBook',
                        'policyDocument',
                        'deathCert',
                        'hospitalDocument',
                        'fir'
                    ];
                    break;

                case "HealthInsurance":
                    Model = HealthInsurance;
                    populateFields = ['policyDocs', 'finalBill', 'passbook'];
                    break;

                default:
                    return res.status(400).json({ message: "Unsupported policy model" });
            }


            let query = Model.findById(policyId);

            for (const field of populateFields) {
                query = query.populate(field);
            }

            const insuranceDoc = await query;

            if (!insuranceDoc) {
                return res.status(404).json({ message: "Policy data not found" });
            }

            const insuranceRecord = {
                ...insuranceDoc.toObject(),
                policyModel
            };

            console.log(insuranceRecord);

            const responseFromAi = await getAIInsights.evaluateRisk(insuranceRecord);
            if (!responseFromAi) {
                return res.status(500).json({ message: "Failed to get response from AI service" });
            }

            claimRecord.aiScore = responseFromAi.aiScore;
            claimRecord.aiConfidence = responseFromAi.aiConfidence;
            claimRecord.aiSuggestions = responseFromAi.aiSuggestions;
            claimRecord.riskFactors = responseFromAi.riskFactors;

            await claimRecord.save();

            return res.status(200).json({ message: "AI Evaluation completed", responseFromAi });

        } catch (err) {
            console.error("AI Evaluation Error:", err.message);
            return res.status(500).json({
                message: "AI Evaluation failed due to server error",
                error: err.message
            });
        }
    }
}

const riskEngineController = new RiskEngineController();
export default riskEngineController;