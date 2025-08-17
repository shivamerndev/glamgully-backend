import express from "express"
import adminRouter from "./routes/admin.route.js"
import productRouter from "./routes/product.route.js"
import customerRouter from './routes/customer.route.js'
import paymentRouter from './routes/payment.route.js';
import orderRouter from './routes/order.route.js';
import reviewRouter from './routes/comment.route.js';
import imgreviewRouter from './routes/review.routes.js';
import notificationRoutes from './routes/notification.routes.js'
import connectDB from "./db/db.connect.js"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import admin from 'firebase-admin'
// import { readFile } from 'fs/promises';
dotenv.config()
const port = process.env.PORT || 3000;
const app = express()


const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
};


//  const serviceAccountContent = await readFile('./firebase-admin-key.json', 'utf8');
//     const serviceAccount = JSON.parse(serviceAccountContent);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
connectDB()

app.use(cors({
  origin: "https://glamgully.vercel.app",
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get("/", (req, res) => { res.send("Welcome To Backend Of GlamGully.") })

app.use("/admin", adminRouter)
app.use("/product", productRouter)
app.use("/users", customerRouter)
app.use("/review", reviewRouter)
app.use("/pay", paymentRouter);
app.use("/order", orderRouter);
app.use("/img/review", imgreviewRouter);
app.use('/api', notificationRoutes);

app.listen(port, () => { console.log('listening on port', port) })