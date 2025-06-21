import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async(localFilePath, resourceType = 'raw') => {
    return await cloudinary.uploader.upload(localFilePath, {
        type: 'authenticated',
        folder:'claims',
        resource_type : resourceType,
        image_metadata : true
    });
};

export default uploadToCloudinary;