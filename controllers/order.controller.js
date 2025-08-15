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
        const totalOrders = await orderModel.countDocuments();
        const allOrders = await orderModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: totalOrders,
            total: allOrders
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};
