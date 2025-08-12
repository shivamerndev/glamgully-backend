import orderModel from '../models/order.model.js'

export const createOrder = async (req, res) => {
    try {
        const { title, price, stock } = req.body;
        if (!price || !stock) return res.status(400).send("something missing.")
        const order = await orderModel.create({
            title, price, stock
        })
        res.status(201).send(order)
    } catch (error) {
        res.send(error)
    }
}
export const readOrder = async (req, res) => {
    try {
        const allorders = await orderModel.find()
        res.status(200).send(allorders);
    } catch (error) {
        res.send(error)
    }
}