// File -> Local Storage -> upload on cloudinary using multer
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
    try {
         if(!path) return [null,"Path is Incorrect"];

        // Upload on cloudinary
     const response = await cloudinary.uploader.upload(path, {
            resource_type: "auto"
        })

        console.log("File is uploaded on cloudinary Succesfully");

    } catch (error) {
        fs.unlinkSync(path)
        return null;
    }
}

export {uploadOnCloudinary};