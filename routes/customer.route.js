import express from 'express'
import { allCustomer, createNew } from '../controllers/customer.controller.js'
const Router = express.Router()

Router.post("/create",createNew)
Router.get("/all",allCustomer)

export default Router;