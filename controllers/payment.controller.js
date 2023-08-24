import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import crypto from "crypto";
const getRazorPayApiKey = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Razorpay API key",
        key: process.env.RAZORPAY_KEY_ID
    });
}

const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        console.log(user);
        console.log(1);
        if (!user) {
            return next(new AppError("Unauthorized, please login"));
        }
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase a subscription!", 400));
        }
        console.log(1.1);
        try{
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        });}catch(e){
            return next(new AppError(e.message,e.status));
        }
        console.log(1.2);
        // console.log(Subscription);
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        console.log(1.3);
        await user.save();
        console.log(1.4);
        res.status(200).json({
            success: true,
            message: "Subscribed successfully",
            subscription_id: subscription.id
        })
    } catch (e) {
        return next(new AppError(e.message, e.status));
    }
}

const verifySubscription = async (req, res, next) => {
    const { id } = req.user;
    const {
        razorpay_payment_id, razorpay_signature, razorpay_subscription_id
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("Unauthorized, please login"));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(new AppError("Payment not verified, please try again", 500));
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
    });

    user.subscription.status = "active"

    await user.save();
    res.status(200).json({
        success: true,
        message: "Payment verified successfully!"
    });
}
const cancelSubscription = async (req, res) => {

}
const allPayments = async (req, res) => {

}

export {
    getRazorPayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}