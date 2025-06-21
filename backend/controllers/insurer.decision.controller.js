import Claim from "../models/claim.model.js";

class DecisionController {
    
    async setReview(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim not found" });
            }

            const updatedClaimRecord = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: "UnderReview"
                    }
                }
            );

            return res.status(200).json({ message: "Claim set to review" });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to send Claim to review",
                error: err.message
            })
        }
    }

    async setApprove(req, res) {
        try {

            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim not found" });
            }

            const updatedClaimRecord = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: "Settled"
                    }
                }
            );

            return res.status(200).json({ message: "Claim settled" });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to settle Claim",
                error: err.message
            })
        }
    }

    async setReject(req, res) {
        try {
            const { id } = req.params;

            const { rejectionReason, rejectionAdditionalData } = req.body;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim not found" });
            }

            const updatedClaimRecord = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: "Rejected",
                        rejectionReason,
                        rejectionAdditionalData
                    }
                }
            );

            return res.status(200).json({ message: "Claim Rejected" });
            
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to reject Claim",
                error: err.message
            })
        }
    }
}


const decisionController = new DecisionController();
export default decisionController;