const express = require('express');
// const mongoose = require('mongoose');
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

paymentRouter.post("/payment/webhook", async (req, res) => {

    try {

        // console.log("Webhook event:", req.body.event);   

        const webhookSignature = req.get('X-Razorpay-Signature');

        // console.log("signature:", webhookSignature);

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);

        if (!isWebhookValid) {
            return res.status(400).json({ error: "Invalid webhook signature" });
        }

        //Update the payment status in DB
        if (req.body.event !== "payment.captured") {
            return res.status(200).json({ msg: "Event ignored" });
        }
        const paymentDetails = req.body.payload.payment.entity;

        if (paymentDetails.status !== "captured") {
            // console.log("Payment not captured, status:", paymentDetails.status);
            return res.status(200).json({ msg: "Payment not successful" });
        }

        // console.log("DB NAME:", mongoose.connection.name);
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        if (!payment) {
            return res.status(404).json({ msg: "Payment record not found" });
        }
        if (payment.status === "captured") {
            return res.status(200).json({ msg: "Already processed" });
        }
        payment.status = paymentDetails.status;
        await payment.save();
        // console.log("Payment status updated in DB");
        // console.log("DB NAME:", mongoose.connection.name);

        //Update the user to premium membership


        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            {
                $set: {
                    isPremium: true,
                    membershipType: payment.notes.membershipType,
                },
            },
            { new: true }
        );

        // console.log("UPDATED USER FROM DB:", updatedUser);


        // if(req.body.event === "payment.captured") {

        // }
        // if(req.body.event === "payment.failed") {}

        //Return the status successful to webhook otherwise it will again-and-again send the same request
        return res.status(200).json({ msg: "successful" });

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {

    try {
        const user = await User.findById(req.user._id);
        console.log("Verifying premium status for user:", user);
        if (user.isPremium) {
            return res.json({ isPremium: true });
        }

        return res.json({ isPremium: false });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = paymentRouter;