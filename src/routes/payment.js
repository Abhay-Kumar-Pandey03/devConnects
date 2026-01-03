const express = require('express');
const mongoose = require('mongoose');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay');
const { userAuth } = require('../middlewares/auth');
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {

        // console.log("Entered into payment creation");
        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user;

        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            },

        });

        console.log("Order created:");

        // Save it in my database
        console.log(order);
        const payment = new Payment({

            orderId: order.id,
            userId: req.user._id,
            amount: order.amount,
            currency: order.currency,
            status: order.status,
            receipt: order.receipt,
            notes: order.notes,
        });

        const savedPayment = await payment.save();
        //Send back the response
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID, });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

paymentRouter.post(
    "/payment/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        try {
            const webhookSignature = req.headers["x-razorpay-signature"];

            const isWebhookValid = validateWebhookSignature(
                req.body, // ✅ RAW BUFFER
                webhookSignature,
                process.env.RAZORPAY_WEBHOOK_SECRET
            );

            if (!isWebhookValid) {
                return res.status(400).json({ error: "Invalid webhook signature" });
            }

            const payload = JSON.parse(req.body.toString());

            console.log("Webhook event:", payload.event);
            console.log("DB NAME:", mongoose.connection.name);

            // ✅ ONLY act on successful payment
            if (payload.event !== "payment.captured") {
                return res.status(200).json({ msg: "Event ignored" });
            }

            const paymentDetails = payload.payload.payment.entity;

            const payment = await Payment.findOne({
                orderId: paymentDetails.order_id,
            });

            if (!payment) {
                return res.status(404).json({ error: "Payment not found" });
            }

            await Payment.updateOne(
                { _id: payment._id },
                { status: paymentDetails.status }
            );

            const updatedUser = await User.findByIdAndUpdate(
                payment.userId,
                {
                    isPremium: true,
                    membershipType: payment.notes.membershipType,
                },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            console.log("✅ User membership updated to premium");

            return res.status(200).json({ msg: "Webhook processed successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
);

module.exports = paymentRouter;