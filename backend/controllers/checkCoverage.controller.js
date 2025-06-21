import VehicleInsurance from "../models/vehicleInsurance.model.js";
import LifeInsurance from "../models/lifeInsurance.model.js";
import HealthInsurance from "../models/healthInsurance.model.js";
import CheckPolicyCoverage from "../models/checkPolicyCoverage.model.js";
import handleMultipleUploads from "../utils/handleFileUpload.js";
import getAIInsights from "../services/getAIInsights.service.js";


class CheckCoverageController {

    async checkVehicleInsurance(req, res) {
        try {
            console.log(req.body, req.files);
            const fileMetaMap = await handleMultipleUploads(req);

            const firebaseUid = req.user.firebaseUid;

            const {
                uin,
                regNo,
                drivingLisence,
                ownerName,
                email,
                govtId,
                carNum
            } = req.body;

            const newVehicleInsurance = await VehicleInsurance.create({
                firebaseUid: firebaseUid,
                claimForm: fileMetaMap?.claimForm?.[0]?._id || null,
                uin,
                regNo,
                drivingLisence,
                ownerName,
                email,
                govtId,
                carNum,
                claimform: fileMetaMap?.claimForm?.[0]?._id || null,
                vehicleIdentity: fileMetaMap?.vehicleIdentity?.map(f => f._id) || null,
                damageImage: fileMetaMap?.damageImage?.map(f => f._id) || null,
                recipt: fileMetaMap?.recipt?.[0]?._id || null
            });

            const newClaimCheck = await CheckPolicyCoverage.create({
                firebaseUid: firebaseUid,
                policyType: 'vehicle-insurance',
                details: newVehicleInsurance._id,
                policyModel: 'VehicleInsurance',
            });

            return res.status(200).json({
                message: "Vehicle Insurance created for Claim Check",
                data: {
                    vehicleInsurance: newVehicleInsurance,
                    checkPolicyCoverage: newClaimCheck,
                }
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to create a new claim for Claim Check",
                error: err.message
            })
        }
    }


    async checkLifeInsurance(req, res) {
        try {
            const fileMetaMap = await handleMultipleUploads(req);
            const firebaseUid = req.user.firebaseUid;

            const {
                uin,
                policyNumber,
                policyHolderName,
                dob,
                dateOfDeath,
                causeOfDeath,
                nomineeName,
                nomineeRelation,
                nomineeEmail,
                nomineePhone,
                nomineeGovtId,
                nomineeAccountNo,
                nomineeIFSC,
                nomineeBankName
            } = req.body;

            const newLifeInsurance = await LifeInsurance.create({
                firebaseUid,
                uin,
                policyNumber,
                policyHolderName,
                dob,
                dateOfDeath,
                causeOfDeath,
                insuranceClaimForm: fileMetaMap?.insuranceClaimForm?.[0]?._id || null,
                policyDocument: fileMetaMap?.policyDocument?.[0]?._id || null,
                deathCert: fileMetaMap?.deathCert?.[0]?._id || null,
                hospitalDocument: fileMetaMap?.hospitalDocument?.[0]?._id || null,
                fir: fileMetaMap?.fir?.[0]?._id || null,
                nominee: {
                    name: nomineeName,
                    relation: nomineeRelation,
                    email: nomineeEmail,
                    phone: nomineePhone,
                    govtId: nomineeGovtId,
                    accountNo: nomineeAccountNo,
                    IFSC: nomineeIFSC,
                    bankName: nomineeBankName,
                    passBook: fileMetaMap?.passBook?.[0]?._id || null
                }
            });

            const newClaimCheck = await CheckPolicyCoverage.create({
                firebaseUid,
                policyType: 'life-insurance',
                details: newLifeInsurance._id,
                policyModel: 'LifeInsurance',
            })

            return res.status(201).json({
                message: "Life insurance claim successfully created",
                data: {
                    lifeInsurance: newLifeInsurance,
                    checkPolicyCoverage: newClaimCheck
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to create life insurance claim",
                error: err.message
            });
        }
    }

    async checkHealthInsurance(req, res) {
        try {
            const fileMetaMap = await handleMultipleUploads(req);
            const firebaseUid = req.user.firebaseUid;

            const {
                uin,
                policyNumber,
                policyHolderName,
                gender,
                dob,
                email,
                phone,
                hospitalName,
                totalClaimAmt,
                govtId
            } = req.body;

            const newHealthInsurance = await HealthInsurance.create({
                firebaseUid,
                uin,
                policyNumber,
                policyHolderName,
                gender,
                dob,
                email,
                phone,
                hospitalName,
                totalClaimAmt,
                govtId,
                policyDocs: fileMetaMap?.policyDocs?.[0]?._id || null,
                finalBill: fileMetaMap?.finalBill?.[0]?._id || null,
                medicalDocs: fileMetaMap?.medicalDocs?.[0]?._id || null
            });

            const newClaimCheck = await CheckPolicyCoverage.create({
                firebaseUid,
                policyType: 'health-insurance',
                details: newHealthInsurance._id,
                policyModel: 'HealthInsurance',
            });

            return res.status(201).json({
                message: "Health insurance claim successfully created",
                data: {
                    healthInsurance: newHealthInsurance,
                    checkPolicyCoverage: newClaimCheck
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to create health insurance claim",
                error: err.message
            });
        }
    }


    async getScore(req, res) {
        const { id } = req.params;

        try {
            console.log("=== getScore Debug ===");
            console.log("Looking for CheckPolicyCoverage with ID:", id);
            console.log("User firebaseUid:", req.user.firebaseUid);
            
            const claimRecord = await CheckPolicyCoverage.findById(id);

            console.log("Found claimRecord:", claimRecord);

            if (!claimRecord) {
                console.log("No CheckPolicyCoverage record found with ID:", id);
                return res.status(404).json({ message: "No record of claims found" });
            }

            console.log("Claim record found:", {
                id: claimRecord._id,
                firebaseUid: claimRecord.firebaseUid,
                policyType: claimRecord.policyType,
                policyModel: claimRecord.policyModel,
                details: claimRecord.details
            });

            let Model;
            let populateFields = [];
            let aiResponse = null;

            // Dynamically resolve model and populate fields
            if (claimRecord.policyModel === "LifeInsurance") {
                Model = LifeInsurance;
                populateFields = ["insuranceClaimForm", "policyDocument", "deathCert", "hospitalDocument", "fir", "nominee.passBook"];
            } else if (claimRecord.policyModel === "VehicleInsurance") {
                Model = VehicleInsurance;
                populateFields = ["claimForm", "vehicleIdentity", "damageImage", "recipt"];
            } else if (claimRecord.policyModel === "HealthInsurance") {
                Model = HealthInsurance;
                populateFields = ["policyDocs", "finalBill", "medicalDocs"];
            } else {
                return res.status(400).json({ message: "Unknown policy model" });
            }

            // Fetch and populate insurance document
            const insureDoc = await Model.findById(claimRecord.details).populate(populateFields);

            if (!insureDoc) {
                return res.status(404).json({ message: "Insurance Data not found" });
            }

            console.log(insureDoc);

            // Call respective AI function
            if (claimRecord.policyModel === "VehicleInsurance") {
                aiResponse = await getAIInsights.getAIClaimCheckVehicle(insureDoc);
            } else if (claimRecord.policyModel === "LifeInsurance") {
                aiResponse = await getAIInsights.getAIClaimCheckLife(insureDoc);
            } else if (claimRecord.policyModel === "HealthInsurance") {
                aiResponse = await getAIInsights.getAIClaimCheckHealth(insureDoc);
            } else {
                return res.status(400).json({ message: "Unsupported policy type for AI analysis" });
            }
            
            console.log("ai res ->", aiResponse);
            
            // Check if AI response is valid
            if (!aiResponse) {
                return res.status(500).json({ message: "AI analysis failed - no response received" });
            }
            
            // Save AI results
            claimRecord.aiScore = aiResponse.aiScore;
            claimRecord.aiConfidence = aiResponse.aiConfidence;
            claimRecord.aiSuggestions = aiResponse.aiSuggestions;

            await claimRecord.save();

            return res.status(200).json({
                message: "AI analysis completed",
                data: aiResponse
            });

        } catch (err) {
            console.error("AI Analysis Error:", err.message);
            return res.status(500).json({ message: "AI processing failed", error: err.message });
        }
    }


    async getAllClaimCheckData(req, res) {
        try {
            const firebaseUid = req.user.firebaseUid;

            let claimCheckArray = [];

            const claimCheckRecords = await CheckPolicyCoverage.find({ firebaseUid });

            if (!claimCheckRecords || claimCheckRecords.length === 0) {
                return res.status(200).json({ claimChecks: [] });
            }

            for (const claimCheck of claimCheckRecords) {

                const insuranceId = claimCheck.details;

                let Model;
                if (claimCheck.policyModel === "LifeInsurance") Model = LifeInsurance;
                else if (claimCheck.policyModel === "VehicleInsurance") Model = VehicleInsurance;
                else if (claimCheck.policyModel === "HealthInsurance") Model = HealthInsurance;
                else {
                    throw new Error("Unknown Policy");
                }

                const insuranceDetails = await Model.findById(insuranceId);

                claimCheckArray.push({
                    claimCheck,
                    insuranceDetails
                });
            }
            return res.status(200).json({
                claimCheckArray
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to fetch claim check record",
                error: err.message
            });
        }

    }

    async getClaim(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await CheckPolicyCoverage.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not found" });
            }

            const insuranceId = claimRecord.details;

            let Model;
            if (claimRecord.policyModel === "LifeInsurance") Model = LifeInsurance;
            else if (claimRecord.policyModel === "VehicleInsurance") Model = VehicleInsurance;
            else if (claimRecord.policyModel === "HealthInsurance") Model = HealthInsurance;
            else {
                throw new Error("Unknown Policy");
            }

            const insuranceDetails = await Model.findById(insuranceId);

            if (!insuranceDetails) {
                return res.status(404).json({ message: "Insurance of this claim Not found" });
            }


            return res.status(200).json({
                claimRecord,
                insuranceDetails
            });

        } catch (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Failed to fetch claim records",
                error: err.message
            });
        }
    }

}

const checkCoverageController = new CheckCoverageController();
export default checkCoverageController;