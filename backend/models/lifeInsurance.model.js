import mongoose from "mongoose";

const lifeInsuranceSchema = mongoose.Schema({
    firebaseUid : {
        type : String,
        ref : 'User',
        required : true
    },
    insuranceClaimForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload'
    },
    uin: String,
    policyNumber: String,
    policyHolderName: String,
    dob: Date,
    nominee: {
        name: String, 
        relation: String,
        email: String,
        phone: Number,
        govtId: String,
        accountNo: Number,
        IFSC: String,
        bankName: String,
        passBook : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Upload'
        }
    },
    dateOfDeath : Date,
    causeOfDeath : String,
    policyDocument : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    deathCert : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    hospitalDocument : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    fir : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    }
})

const LifeInsurance = new mongoose.model("LifeInsurance", lifeInsuranceSchema);
export default LifeInsurance;