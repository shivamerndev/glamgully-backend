import Razorpay from 'razorpay';
import paymodel from '../models/payment.model.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount),
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(201).json({ order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}

export const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const payment =  paymodel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })
        res.status(200).json({ payment: payment, message: "Payment successfully" });
    }
}