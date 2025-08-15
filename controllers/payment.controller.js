import Razorpay from 'razorpay';
import paymodel from '../models/payment.model.js';
import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// product Formatter
const ProductFormatter = (products) => {
    if (products.length > 0) {
        return products
            .map(p => `${p.title}: ${p.quantity}`)
            .join("\n"); // har product ek nayi line pe
    }
    return `${products.title}: ${products.quantity}`
};

// 🧾  Address Formatter
const formatAddress = (addr) => {
    const { address, landmark, city, state, pincode } = addr;
    return `${address}, ${landmark || ""}, ${city}, ${state} - ${pincode}`;
};
// WhatsApp notification function
const sendAdminWhatsApp = async (orderId, amount, address, products) => {
    try {
        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio Sandbox number
            body: `✅ New payment received!\nOrder ID: ${orderId}\nAmount: ₹${amount / 100}\nAddress: ${formatAddress(address)}\n ⬇️⬇️ Products : Quantity ⬇️⬇️\n ${ProductFormatter(products)}`,
            // contentSid: 'HX350d429d32e64a552466cafecbe95f3c', // Tumhara template SID
            // contentVariables: JSON.stringify({
            //     "1": orderId,            // Template ka {1}
            //     "2": `₹${amount / 100}`, // Template ka {2}
            //     "3": address
            // }),
            to: process.env.ADMIN_WHATSAPP // Admin ka WhatsApp number (sandbox join kiya ho)
        });
        console.log("✅ WhatsApp notification sent to admin");
    } catch (err) {
        console.error("❌ Failed to send WhatsApp:", err);
    }
};

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

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, address, products } = req.body;


    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const payment = paymodel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })
        // ✅ Send WhatsApp Notification to Admin
        await sendAdminWhatsApp(razorpay_order_id, amount, address, products);

        res.status(200).json({ payment: payment, message: "Payment successfully" });
    }
}
// ✅ Razorpay Webhook
export const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const receivedSig = req.headers['x-razorpay-signature'];

        const generatedSig = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (generatedSig !== receivedSig) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Webhook me data aayega
        const event = req.body.event;
        if (event === "payment.captured") {
            const payload = req.body.payload.payment.entity;
            console.log("✅ Payment captured:", payload);

            // WhatsApp Notification bhejna
            await sendAdminWhatsApp(
                payload.order_id,
                payload.amount,
                { address: "Webhook address", city: "", state: "", pincode: "" }, // Optional: yaha order DB se real address fetch karna better hai
                [] // Optional: yaha products bhi fetch karke bhejna
            );
        }

        res.status(200).json({ message: "Webhook received" });
    } catch (err) {
        console.error("❌ Webhook error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
