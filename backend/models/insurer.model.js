import mongoose from "mongoose";

const insurerSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        unique: true,
        required: true,
    },
    irdai: {
        type: String,
        unique: true
    },
    orgName: String,
    companyCode: String,
    email: String,
    phone: Number,
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload'
    }],
    pan: String,
    tan: String,

});

const Insurer = mongoose.model("Insurer", insurerSchema);
export default Insurer;