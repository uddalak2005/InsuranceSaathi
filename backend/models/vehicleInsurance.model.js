import mongoose from "mongoose";

const vehicleInsuranceSchema = new mongoose.Schema({
    firebaseUid : {
        type : String,
        ref : 'User',
        required : true
    },
    claimForm : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    },
    uin : String,
    regNo : String,
    drivingLisence : String,
    carNum : String,
    ownerName : String,
    email : String,
    govtId : String,
    claimAmt: Number,
    vehicleIdentity : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    }],
    damageImage : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    }],
    recipt : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Upload'
    }
})

const VehicleInsurance = new mongoose.model("VehicleInsurance", vehicleInsuranceSchema);
export default VehicleInsurance;