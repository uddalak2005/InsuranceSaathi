import Claim from "../models/claim.model.js";
import VehicleInsurance from "../models/vehicleInsurance.model.js";
import HealthInsurance from "../models/healthInsurance.model.js";
import LifeInsurance from "../models/lifeInsurance.model.js";
import Upload from "../models/upload.model.js";
import { v2 as cloudinary } from 'cloudinary';
import axios from "axios";


class ClaimDocs {

    constructor(CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME) {

        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
        });
    }

    getNested = (obj, path) => {
        return path.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);
    };

    formatDoc = (doc) => {
        return {
            _id: doc._id,
            url: doc.url,
            fileName: doc.originalName,
            uploadedAt: doc.createdAt,
            fileType: doc.fileType,
            fieldName: doc.fieldName
        };
    };

    getClaimDocs = async (req, res) => {
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

            const populatedClaim = await Model.findById(policyId).populate(populateFields.join(' '));

            const docDetails = {};

            for (const field of populateFields) {
                const value = this.getNested(populatedClaim, field);

                if (Array.isArray(value)) {
                    docDetails[field] = value.map(doc => this.formatDoc(doc));
                } else if (value) {
                    docDetails[field] = [this.formatDoc(value)];
                } else {
                    docDetails[field] = [];
                }
            }

            return res.status(200).json({ documents: docDetails });

        } catch (err) {
            console.error("getClaimDocs error:", err);
            return res.status(500).json({ message: "Server error while fetching documents" });
        }
    }



    async previewDocument(req, res) {
        try {
            const { id } = req.params;

            const doc = await Upload.findById(id);
            if (!doc) {
                return res.status(404).json({ message: "Document not found" });
            }

            const publicId = doc.publicId;
            const fileType = doc.fileType;


            const secureUrl = cloudinary.url(publicId, {
                type: "authenticated",
                resource_type: fileType,
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 300
            });

            return res.redirect(secureUrl);

        } catch (err) {
            console.error("Preview error:", err);
            return res.status(500).json({ message: "Server error while previewing document" });
        }
    };

    async downloadDocument(req, res) {
        try {
            const { id } = req.params;

            const doc = await Upload.findById(id);
            if (!doc) {
                return res.status(404).json({ message: "Document not found" });
            }

            const publicId = doc.publicId;
            const fileType = doc.fileType;

            const downloadUrl = cloudinary.url(publicId, {
                type: "authenticated",
                resource_type: fileType,
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 300,
            });

            const fileName = doc.originalName || "document.pdf"; // fallback name

            const fileResponse = await axios.get(downloadUrl, {
                responseType: "stream"
            });

            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            res.setHeader("Content-Type", fileResponse.headers["content-type"]);

            fileResponse.data.pipe(res);

        } catch (err) {
            console.error("Download error:", err);
            return res.status(500).json({ message: "Server error while downloading document" });
        }
    }
}

const claimDocs = new ClaimDocs(
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
    process.env.CLOUDINARY_CLOUD_NAME
);

export default claimDocs;
