const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImageToCloudinary = async(localFilePath) => {
    if (!localFilePath) {
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });
        return response;
    } catch (error) {
        throw error;
    } finally {
        try { fs.unlinkSync(localFilePath); } catch (_) {}
    }
}

const uploadVideoToCloudinary = async(localFilePath) => {
    if (!localFilePath) {
        return null;
    }
    try {
        // Use upload_large for videos to handle files >100MB reliably
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            // chunk_size: 6 * 1024 * 1024 // 6MB chunks
        });
        return response;

    } catch (error) {
        throw error;
    } finally {
        try { fs.unlinkSync(localFilePath); } catch (_) {}
    }
}

module.exports = {
    uploadImageToCloudinary,
    uploadVideoToCloudinary
};