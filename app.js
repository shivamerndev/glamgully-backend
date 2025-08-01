import express from "express"
import adminRouter from "./routes/admin.route.js"
import productRouter from "./routes/product.route.js"
import customerRouter from './routes/customer.route.js'
import paymentRouter from './routes/payment.route.js';

import connectDB from "./db/db.connect.js"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const port = process.env.PORT || 3000;
const app = express()
connectDB()

app.use(cors({
    origin: ["https://glamgully.vercel.app", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => { res.send("Welcome To Backend Of GlamGully.") })

app.use("/admin", adminRouter)
app.use("/product", productRouter)
app.use("/users", customerRouter)
app.use("/pay", paymentRouter);

app.listen(port, () => { console.log('listening on port', port) })