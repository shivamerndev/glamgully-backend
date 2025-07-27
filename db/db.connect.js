import mongoose from "mongoose";

function connectDB() {
    mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
        console.log("Database connected successfully")
    }).catch(err => {
        console.log(err) 
    }) 
}
export default connectDB;