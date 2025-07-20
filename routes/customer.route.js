import express from 'express'
import { createNew } from '../controllers/customer.controller.js'
const Router = express.Router()

Router.post("/create",createNew)

export default Router;