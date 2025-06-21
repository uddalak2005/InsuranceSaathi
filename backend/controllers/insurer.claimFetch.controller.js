import Insurer from "../models/insurer.model.js";
import Claim from "../models/claim.model.js";
import VehicleInsurance from "../models/vehicleInsurance.model.js";
import LifeInsurance from "../models/lifeInsurance.model.js";
import HealthInsurance from "../models/healthInsurance.model.js";

class FetchClaimController {

    async fetchClaimsBasedOnIrdai(req, res) {
        try {
            const firebaseUid = req.user.firebaseUid;

            const insurerRecord = await Insurer.findOne({ firebaseUid });

            if (!insurerRecord) {
                return res.status(404).json({ message: "Insurer not registered" });
            }

            const irdai = insurerRecord.irdai;

            const claimRecords = await Claim.find({
                insurerIrdai: irdai
            });

            if (claimRecords.length === 0) {
                return res.status(200).json({ claimRecords: [] });
            }

            return res.status(200).json({ claimRecords });

        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Failed to fetch claims",
                error: err.message
            })
        }
    }

    async fetchClaimData(req, res) {
        try {

            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "No Claims Found" });
            }

            const insuranceId = claimRecord.policyId;
            const insuranceModel = claimRecord.policyModel;

            let Model;
            if (insuranceModel === "VehicleInsurance") Model = VehicleInsurance;
            else if (insuranceModel === "LifeInsurance") Model = LifeInsurance;
            else if (insuranceModel === "HealthInsurance") Model = HealthInsurance;
            else {
                throw new Error("Unknown Policy Type");
            }

            const insuranceRecord = await Model.findById(insuranceId);

            if (!insuranceRecord) {
                return res.status(404).json({ message: "Policy Not found" });
            }

            return res.status(200).json({ insuranceRecord })

        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Failed to fetch policy",
                error: err.message
            })
        }
    }
}

const fetchClaimController = new FetchClaimController();
export default fetchClaimController;