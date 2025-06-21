import fs from 'fs';
import Upload from '../models/upload.model.js'
import uploadToCloudinary from '../services/cloudinary.service.js';

class UploadController {
    async uploadFile(req, res) {
        try {
            console.log("uploac=d controller");
            if (!req.file) {
                return res.status(400).json({ message: "No file Upload" });
            }

            const filePath = req.file.path;
            const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'raw';

            console.log(fileType)

            const result = await uploadToCloudinary(filePath, fileType);

            fs.unlinkSync(filePath);

            const uploadRecord = await Upload.create({
                uploadedBy : req.user.firebaseUid,
                fileurl : result.secure_url,
                publicId : result.public_id,
                fileType : fileType,
                originalName : req.file.originalname,
            });

            return res.status(200).json({
                message : 'File Uploaded successfully',
                date : uploadRecord
            });
        }catch(err) {
            console.log(err?.message);
            return res.status(500).json({
                message : 'Upload failed',
                error : err?.message
            })
        }
    }
}

const uploadController = new UploadController();
export default uploadController;