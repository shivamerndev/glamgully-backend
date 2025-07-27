import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    }
})

export default mongoose.model("cutomer", customerSchema)