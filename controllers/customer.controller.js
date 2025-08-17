import customerModel from '../models/customer.model.js'

export const createNew = async (req, res) => {
    try {
        const { fullname, phone } = req.body;
        if (!fullname || !phone) return res.status(400).send("All feilds are required.")
        const isExisted = await customerModel.findOne({ phone:phone }) 
        if (isExisted) return res.status(400).send("thank you so much for shopping again.")
        const customer = await customerModel.create({
            fullname, phone
        })
        res.status(201).send(customer)
    } catch (error) {
        res.send(error.message)
    }
}
export const allCustomer = async (req, res) => {
    try {
        const customers = await customerModel.find()
        res.status(200).send(customers)
    } catch (error) {
        res.send(error.message)
    }
}
