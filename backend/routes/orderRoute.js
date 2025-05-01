import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    listOrders,
    placeOrder,
    updateStatus,
    userOrders,
    verifyOrder,
    placeOrderCod
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// 🟢 Existing Routes
orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

// ✅ NEW: Dummy Payment Gateway Route (Stripe-like)
orderRouter.post("/create-payment", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        // Simulate a payment session URL (replace with Stripe session URL in real-world usage)
        const sessionUrl = `http://localhost:5173/payment-gateway?amount=${amount}`;

        res.json({
            success: true,
            message: "Redirecting to payment gateway...",
            session_url: sessionUrl
        });
    } catch (error) {
        console.error("Payment session error:", error);
        res.status(500).json({ success: false, message: "Payment session failed" });
    }
});

export default orderRouter;