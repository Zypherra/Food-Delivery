import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing order from frontend
const placeOrder = async (req, res) => {

    const frontend_url="http://localhost:5174";
    
    try {
        // userId is set by authMiddleware in req.body.userId
        const { items, amount, address, paymentMethod } = req.body;
        const userId = req.body.userId;

        // Validate payment method
        const validMethods = ['COD', 'Online'];
        if (!validMethods.includes(paymentMethod)) {
            return res.json({ success: false, message: "Invalid payment method" });
        }

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        // Determine if payment is already completed
        // For Online payment (mock), we'll mark it as paid immediately for simulation
        // For COD, payment is false (pay later)
        const isPaid = paymentMethod === 'Online';

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: isPaid
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id,
            paymentMethod: paymentMethod
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Verify payment (for mock online payment)
const verifyPayment = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            // Payment failed, delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying payment" });
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
}

export { placeOrder, verifyPayment, userOrders, listOrders, updateStatus };