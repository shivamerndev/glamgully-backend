import express from "express"
import { adminDashboard, adminLogin, adminRegister } from "../controllers/admin.controller.js"
import adminAuth from "../middlewares/admin.auth.js"
const Router = express.Router()

Router.get("/", (req, res) => { res.send("admin page") })
Router.post("/register",adminRegister)
Router.post("/login",adminLogin)
Router.get("/dashboard",adminAuth,adminDashboard)

export default Router;