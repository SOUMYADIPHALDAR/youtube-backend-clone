const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File upload successfully..", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        if (localFilePath) {
            fs.unlinkSync(localFilePath);
        }
        console.log("something went wrong..", error);
    }
}

module.exports = uploadToCloudinary;