import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    reviewpicture: {
        type: String,
        required:true,
        default: 'https://res.cloudinary.com/dgis42anh/image/upload/v1749317565/logo_ac7mo9.jpg'
    },
}, { timestamps: true })

export default mongoose.model("reviewimg",reviewSchema)