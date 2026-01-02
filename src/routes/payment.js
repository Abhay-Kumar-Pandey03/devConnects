const express = require('express');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay');
const { userAuth } = require('../middlewares/auth');
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constants');
const { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { validate } = require('../models/user');

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try{

        // console.log("Entryed into payment creation");
        const {membershipType} = req.body;
        const {firstName, lastName, emailId} = req.user;

        const order = await razorpayInstance.orders.create({
            amount : membershipAmount[membershipType] * 100, // amount in the smallest currency unit
            currency : "INR",
            receipt : `receipt_order_${Date.now()}`,
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
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID,});
    }
    catch(err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

paymentRouter.post("/payment/webhook", async(req, res) => {
    
    try
    {
        const webhookSignature = req.get['X-Razorpay-Signature'];

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), validateWebhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
        
        if(!isWebhookValid) {
            return res.status(400).json({ error: "Invalid webhook signature" });
        }

        //Update the payment status in DB
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        //Update the user to premium membership

        const user = await User.findOne({ _id : payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if(req.body.event === "payment.captured") {

        // }
        // if(req.body.event === "payment.failed") {}
        
        //Return the status successful to webhook otherwise it will again-and-again send the same request
        return res.status(200).json({ msg: "successful" });
        
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = paymentRouter;