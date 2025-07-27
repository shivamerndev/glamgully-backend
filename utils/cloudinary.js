import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const getCloudinaryResponse = async (file) => {
    try {
        // 👇 Base64 with proper MIME type
        const mimeType = file.mimetype; // e.g., "image/jpeg"
        const base64 = file.buffer.toString("base64");
        const fileuri = `data:${mimeType};base64,${base64}`; // data:image/jpeg;base64,(file.buffer.toString("base64"))
        const result = await cloudinary.uploader.upload(fileuri, {
            folder: "products",
        });
        return result.secure_url;
    } catch (error) {
        console.log(error.message)
    }
}


export default cloudinary;