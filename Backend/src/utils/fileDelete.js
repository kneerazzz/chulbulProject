import {v2 as cloudinary} from "cloudinary"
import dotenv from 'dotenv'


dotenv.config()


cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})


function extractPublicId(cloudinarUrl) {
    const urlParts = cloudinarUrl.split("/")
    const fileName = urlParts.pop().split(".")[0]
    const folderPath = urlParts.slice(urlParts.indexOf("upload") + 1).join("/")
    return `${folderPath}/${fileName}`
}

const deleteFromCloudinary = async(url) => {
    try {
        const publicId = extractPublicId(url)

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        })

        console.log("file deleted successfully", result)
        return result;
    } catch (error) {
        console.log("Error removing files from cloudinary", error)
        return null
    }
}


