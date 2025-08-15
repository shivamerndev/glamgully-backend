import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
    title: {
        type: String,
        // require:true,
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    }
}, { timestamps: true })

const orderModel = mongoose.model("order", orderSchema)

export default orderModel;