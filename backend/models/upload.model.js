import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
    uploadedBy : {
        type : String,
        ref : 'User',
        required : true
    },
    insuranceType: {
        type: String,
        enum: ['health', 'life', 'vehicle', 'travel'],
        // required: true
    },
    fileurl: String,
    publicId: { 
        type: String, 
        required: true 
    },
    originalName: String,
    fileType: String,
    fieldName: String,
    fraudFlag : Boolean,
    createdAt: { 
        type: Date, default: 
        Date.now 
    }
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;