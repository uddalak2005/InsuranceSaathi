import User from "../models/user.model.js";
import Insurer from "../models/insurer.model.js";
import handleMultipleUploads from "../utils/handleFileUpload.js";

class OnboardingController {
    async policyHolderOnboarding(req, res) {
        try {
            const { address, dob, aadhar, pan } = req.body;
            const firebaseUid = req.user.firebaseUid;

            console.log(firebaseUid);
            console.log(req.body);

            const recordUser = await User.findOneAndUpdate({
                firebaseUid: firebaseUid
            }, {
                address: address,
                dob: dob,
                aadhar: aadhar,
                pan: pan
            }, { new: true });

            if (!recordUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                message: "Policy Holder Onboarded Successfully",
                data: recordUser
            })
        } catch (err) {
            console.log(err?.message);
            return res.status(500).json({
                message: "Server error during onboarding",
                error: err?.message
            })
        }
    }

    async insurerOnboarding(req, res) {
        try {
            const fileMetaArray = await handleMultipleUploads(req);

            const {
                pan,
                cin,
                tan,
                phone,
                companyCode,
            } = req.body;

            const firebaseUid = req.user.firebaseUid;

            console.log("firebaseUid from req.user:", firebaseUid);

            const allUploadedField = Object.values(fileMetaArray)
                .flat()
                .map(f => f._id);

            const insurerRecord = await Insurer.findOneAndUpdate({
                firebaseUid: firebaseUid
            }, {
                $set: {
                    pan,
                    cin,
                    tan,
                    phone,
                    companyCode
                },
                $push: {
                    documents: { $each: allUploadedField }
                }
            }, { new: true, upsert: true });

            return res.status(200).json({
                message: "Insurance Company(Insurer) Onboarded Successfully",
                data: insurerRecord
            });

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "Insurance Company(Insurer) Onboarding failed",
                error: err.message,
            });
        }
    }
}

const onboardingController = new OnboardingController();
export default onboardingController;