import customerModel from '../models/customer.model.js'

export const createNew = async (req, res) => {
    try {
        const { fullname, phone } = req.body;
        if (!fullname || !phone) return res.status(400).send("All feilds are required.")
        const customer = await customerModel.create({
            fullname, phone
        })
        res.status(201).send(customer)
    } catch (error) {
        res.send(error.message)
    }
}