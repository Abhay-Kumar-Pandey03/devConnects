const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
        },

        paymentId: {
            type: String,
        },

        notes: {
            firstName: {
                type: String,
            },
            lastName: {
                type: String,
            },
            membershipType: {
                type: String,
            },
        },

        receipt: {
            type: String,
            required: true,
        },

    },

    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);