import VehicleInsurance from "../models/vehicleInsurance.model.js";
import LifeInsurance from "../models/lifeInsurance.model.js";
import HealthInsurance from "../models/healthInsurance.model.js";
import Claim from "../models/claim.model.js";
import Insurer from "../models/insurer.model.js";
import handleMultipleUploads from "../utils/handleFileUpload.js"

class ClaimController {

    async claimVehicleInsurance(req, res) {
        try {
            const fileMetaMap = await handleMultipleUploads(req);

            const firebaseUid = req.user.firebaseUid;

            const {
                insurerIrdai,
                uin,
                regNo,
                drivingLisence,
                ownerName,
                email,
                govtId
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
                claimForm: fileMetaMap?.claimForm?.[0]?._id || null,
                vehicleIdentity: fileMetaMap?.vehicleIdentity?.map(f => f._id) || null,
                damageImage: fileMetaMap?.damageImage?.map(f => f._id) || null,
                recipt: fileMetaMap?.recipt?.[0]?._id || null
            });

            const newClaim = await Claim.create({
                insurerIrdai,
                firebaseUid: firebaseUid,
                policyType: 'vehicle-insurance',
                policyId: newVehicleInsurance._id,
                policyModel: 'VehicleInsurance',
            });

            return res.status(200).json({
                message: "Vehicle Insurance created for Claim Check",
                data: {
                    vehicleInsurance: newVehicleInsurance,
                    newClaim: newClaim,
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

    async claimLifeInsurance(req, res) {
        try {
            const fileMetaMap = await handleMultipleUploads(req);
            const firebaseUid = req.user.firebaseUid;

            const {
                insurerIrdai,
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

            const newClaim = await Claim.create({
                insurerIrdai,
                firebaseUid,
                policyType: 'life-insurance',
                policyId: newLifeInsurance._id,
                policyModel: 'LifeInsurance',
            })

            return res.status(201).json({
                message: "Life insurance claim successfully created",
                data: {
                    lifeInsurance: newLifeInsurance,
                    newClaim: newClaim
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

    async claimHealthInsurance(req, res) {
        try {
            const fileMetaMap = await handleMultipleUploads(req);
            const firebaseUid = req.user.firebaseUid;

            const {
                insurerIrdai,
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
                passbook: fileMetaMap?.passbook?.[0]?._id || null
            });

            const newClaim = await Claim.create({
                insurerIrdai,
                firebaseUid,
                policyType: 'health-insurance',
                details: newHealthInsurance._id,
                policyModel: 'HealthInsurance',
            });

            return res.status(201).json({
                message: "Health insurance claim successfully created",
                data: {
                    healthInsurance: newHealthInsurance,
                    checkPolicyCoverage: newClaim
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

    async editVehicleInsurance(req, res) {
        try {
            const { id } = req.params;

            const fileMetaMap = await handleMultipleUploads(req);

            const firebaseUid = req.user.firebaseUid;

            const {
                insurerIrdai,
                uin,
                regNo,
                drivingLisence,
                ownerName,
                email,
                govtId
            } = req.body;


            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not Found" });
            }

            const insuranceId = claimRecord.policyId;

            const insuranceRecord = await VehicleInsurance.findByIdAndUpdate(
                insuranceId,
                {
                    $set: {
                        firebaseUid: firebaseUid,
                        claimForm: fileMetaMap?.claimForm?.[0]?._id || null,
                        uin,
                        regNo,
                        drivingLisence,
                        ownerName,
                        email,
                        govtId,
                        claimForm: fileMetaMap?.claimForm?.[0]?._id || null,
                        vehicleIdentity: fileMetaMap?.vehicleIdentity?.map(f => f._id) || null,
                        damageImage: fileMetaMap?.damageImage?.map(f => f._id) || null,
                        recipt: fileMetaMap?.recipt?.[0]?._id || null
                    }
                },
                { new: true, upsert: true }
            );

            claimRecord = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        insurerIrdai
                    }
                },
                { new: true }
            )

            return res.status(200).json({
                message: "Vehicle Insurance updated for for Claim",
                data: {
                    vehicleInsurance: insuranceRecord,
                    newClaim: claimRecord,
                }
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Failed to update Claim ",
                error: err.message
            })
        }
    }

    async editLifeInsurance(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);
            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not Found" });
            }

            const fileMetaMap = await handleMultipleUploads(req);
            const firebaseUid = req.user.firebaseUid;

            const {
                insurerIrdai,
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


            const insuranceId = claimRecord.policyId;

            const updatedLifeInsurance = await LifeInsurance.findByIdAndUpdate(
                insuranceId,
                {
                    $set: {
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
                    }
                },
                { new: true, upsert: true }
            );

            claimRecord = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        insurerIrdai
                    }
                },
                { new: true }
            )

            return res.status(200).json({
                message: "Life insurance claim updated successfully",
                data: {
                    updatedLifeInsurance,
                    claim: claimRecord
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to update life insurance claim",
                error: err.message
            });
        }
    }


    async editHealthInsurance(req, res) {
        try {
            const { id } = req.params;
            const firebaseUid = req.user.firebaseUid;
            const fileMetaMap = await handleMultipleUploads(req);

            const {
                insurerIrdai,
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

            const claimRecord = await Claim.findById(id);
            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not Found" });
            }

            const insuranceId = claimRecord.details;

            const insuranceRecord = await HealthInsurance.findByIdAndUpdate(
                insuranceId,
                {
                    $set: {
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
                        passbook: fileMetaMap?.passbook?.[0]?._id || null
                    }
                },
                { new: true, upsert: true }
            );

            const updatedClaim = await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        insurerIrdai
                    }
                },
                { new: true }
            );

            return res.status(200).json({
                message: "Health Insurance updated for Claim",
                data: {
                    healthInsurance: insuranceRecord,
                    updatedClaim
                }
            });
        } catch (err) {
            console.error("Edit Health Insurance Error:", err.message);
            return res.status(500).json({
                message: "Failed to update health insurance claim",
                error: err.message
            });
        }
    }


    async submitInsurance(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not Found" });
            }

            const insurer = await Insurer.findOne({irdai : claimRecord.insurerIrdai});

            if(!insurer){
                return res.status(404).json({
                    message : `The menitoned Insurance company with IRDAI ${claimRecord.insurerIrdai} is either wrong or is not registered on our platform`
                })
            }

            await Claim.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: 'Submitted',
                    }
                }
            );

            return res.status(200).json({ message: "Claim Submitted To Company" });

        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Failed to Submit Claim",
                error: err.message
            })
        }
    }



    async getScore(req, res) {
        const { id } = req.params;

        try {
            const claimRecord = await Claim.findById(id);


            if (!claimRecord) {
                return res.status(404).json({ message: "No record of claims found" });
            }

            let Model;
            if (claimRecord.policyModel === "LifeInsurance") Model = LifeInsurance;
            else if (claimRecord.policyModel === "VehicleInsurance") Model = VehicleInsurance;
            // else if(claimRecord.policy === "HealthInsurance") Model = HealthInsurance;
            else {
                throw new Error("Unknown Policy");
            }

            const insureDoc = await Model.findById(claimRecord.details);


            if (!insureDoc) {
                return res.status(404).json({ message: "Insurance Data not found" });
            }

            //AI Response from Sayantan
            const aiResponse = await getAIInsightsFromFlask(insureDoc);

            claimRecord.aiScore = aiResponse.aiScore;
            claimRecord.aiConfidence = aiResponse.aiConfidence;
            claimRecord.aiSuggestions = aiResponse.aiSuggestions;

            await claimRecord.save();

            return res.status(200).json({
                message: "AI analysis completed",
                data: {
                    aiScore: aiResponse.aiScore,
                    aiConfidence: aiResponse.aiConfidence,
                    aiSuggestions: aiResponse.aiSuggestions
                }
            });
        } catch (err) {
            console.error("AI Analysis Error:", err.message);
            return res.status(500).json({ message: "AI processing failed", error: err.message });
        }
    }

    async getAllClaimsByUser(req, res) {
        try {
            const firebaseUid = req.user.firebaseUid;

            let claimArray = [];

            const claimRecords = await Claim.find({ firebaseUid });

            if (!claimRecords || claimRecords.length === 0) {
                return res.status(200).json({ claimArray: [] });
            }

            for (const claim of claimRecords) {
                const insuranceId = claim.policyId;

                let Model;
                if (claim.policyModel === "LifeInsurance") Model = LifeInsurance;
                else if (claim.policyModel === "VehicleInsurance") Model = VehicleInsurance;
                // else if (claim.policyModel === "HealthInsurance") Model = HealthInsurance;
                else {
                    console.warn("Unknown policy model:", claim.policyModel);
                    continue;
                }

                const insuranceDetails = await Model.findById(insuranceId);

                claimArray.push({
                    claim,
                    insuranceDetails
                });
            }

            return res.status(200).json({ claimArray });

        } catch (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Failed to fetch claim records",
                error: err.message
            });
        }
    }

    async getClaim(req, res) {
        try {
            const { id } = req.params;

            const claimRecord = await Claim.findById(id);

            if (!claimRecord) {
                return res.status(404).json({ message: "Claim Not found" });
            }

            const insuranceId = claimRecord.policyId;

            let Model;
            if (claimRecord.policyModel === "LifeInsurance") Model = LifeInsurance;
            else if (claimRecord.policyModel === "VehicleInsurance") Model = VehicleInsurance;
            // else if (claim.policyModel === "HealthInsurance") Model = HealthInsurance;
            else {
                throw new Error("Unknown Policy");
            }

            const insuranceDetails = await Model.findById(insuranceId);

            if (!claimRecord) {
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

const claimController = new ClaimController();
export default claimController;