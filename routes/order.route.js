import express from 'express'
import { createOrder, readOrder } from '../controllers/order.controller.js';

const Router = express.Router()

Router.post('/create',createOrder)
Router.get('/read',readOrder)

export default Router;