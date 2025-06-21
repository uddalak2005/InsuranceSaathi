import mongoose from "mongoose";

const healthInsuranceSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        ref: 'User'
    },
    uin: String,
    policyNumber: String,
    policyHolderName: String,
    gender : {
        type : String,
        enum : ['male', 'female', 'others']
    },
    dob: Date,
    phone : Number,
    email : String,
    hospitalName : String,
    totalClaimAmt : Number,
    govtId : String,
    policyDocs : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    finalBill : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    passbook : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    }
})

const HealthInsurance = new mongoose.model("HealthInsurance",healthInsuranceSchema);
export default HealthInsurance;