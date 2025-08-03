import express from "express"
import { createProduct, deleteProduct, editProduct, getAllProducts, getAllProductsAdmin, getSingleProduct, searchProduct } from "../controllers/product.controller.js";
import adminAuth from "../middlewares/admin.auth.js";
import upload from "../config/multer.config.js";
const Router = express.Router()

Router.post("/create", adminAuth, upload.array("productimage",5), createProduct)
// Router.post("/create", adminAuth, upload.single("productimage"), createProduct)
Router.get("/getproduct", getAllProducts)
Router.get("/getadminproduct", adminAuth, getAllProductsAdmin)
Router.get("/singleproduct/:productId", getSingleProduct)
Router.post("/editproduct", editProduct)
Router.post("/deleteproduct/:productId", deleteProduct)
Router.post("/search",searchProduct)

export default Router;