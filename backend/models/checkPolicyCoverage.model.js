import mongoose from "mongoose";

const checkPolicyCoverageSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        ref: 'User',
        required: true
    },
    policyType: {
        type: String,
        enum: ['life-insurance', 'vehicle-insurance', 'health-insurance'],
        required: true
    },
    details: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'policyModel'
    },
    policyModel: {
        type: String,
        required: true,
        enum: ['LifeInsurance', 'VehicleInsurance', 'HealthInsurance']
    },
    aiScore: Number,
    aiConfidence: Number,
    aiSuggestions: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CheckPolicyCoverage = mongoose.model("CheckPolicyCoverage", checkPolicyCoverageSchema);
export default CheckPolicyCoverage;
