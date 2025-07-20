import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productimage: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    discount: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    reviews: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model('products', productSchema)