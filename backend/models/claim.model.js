import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    firebaseUid: { type: String, ref: 'User', required: true },

    insurerIrdai : {
        type :String,
    },

    policyType: {
        type: String,
        enum: ['life-insurance', 'vehicle-insurance', 'health-insurance'],
        required: true
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'policyModel'
    },
    policyModel: {
        type: String,
        required: true,
        enum: ['LifeInsurance', 'VehicleInsurance', 'HealthInsurance']
    },

    claimDocs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }],
    status: {
        type: String,
        enum: ['Instantiated','Submitted', 'UnderReview', 'Settled', 'Rejected', 'Excalated'],
        default: 'Instantiated'
    },
    aiScore: { type: Number, min: 0, max: 100 },
    aiConfidence: { type: Number },
    aiSuggestions: { type: String },
    fraudFlag: { type: Boolean, default: false },
    riskFactors : [{
        description : String,
        label : String,
        severity : String
    }],
    rejectionReason: { type: String, default: null },

    rejectionAdditionalData : String,

    appealData: {
        appealSubmitted: { type: Boolean, default: false },
        newDocs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }],
        justification: { type: String }
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Claim = new mongoose.model("Claim", claimSchema);
export default Claim;