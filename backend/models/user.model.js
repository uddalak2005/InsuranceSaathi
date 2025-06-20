import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
    },
    name: String,
    phone: String,
    address: String,
    dob: Date,
    aadhar : String,
    pan : String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
const User = mongoose.model("User", userSchema);
export default User;