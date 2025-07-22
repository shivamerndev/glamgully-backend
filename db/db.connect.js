import mongoose from "mongoose";

function connectDB() {
    mongoose.connect(`${process.env.MONGO_URI}`,{
        serverSelectionTimeoutMS: 30000, // 30 seconds
    }).then(() => {
        console.log("Database connected successfully")
    }).catch(err => {
        console.log(err) 
    }) 
}
export default connectDB;