import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import { config } from "dotenv";

config();
const getRazorPayApiKey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Razorpay API key",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        console.log("buySubscriptionuser is", user);
        if (!user) {
            return next(new AppError("Unauthorized, please login"));
        }
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase a subscription!", 400));
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            quantity: 1,
            total_count: 1,
            addons: [
                {
                    item: {
                        name: "Delivery charges",
                        amount: 300,
                        currency: "INR"
                    }
                }
            ],
            notes: {
                key1: "value3",
                key2: "value2"
            },
            notify_info: {
                notify_phone: +9123456789,
                notify_email: "gaurav.kumar@example.com"
            }
        })
        // console.log(subscription);
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscribed successfully",
            subscription_id: subscription.id,
            subscription
        })
    } catch (e) {
        return next(new AppError(e.message, e.status));
    }
}

const fetchSubscriptionById = async (req, res, next) => {
    try {
        const { sub_id } = req.params;
        const subscriptionDetails = await razorpay.subscriptions.fetch(sub_id);
        res.status(200).json({
            message: "Success",
            subscriptionDetails
        })
    } catch (err) {
        return next(new AppError(err.message, err.status));
    }
}
const verifySubscription = async (req, res, next) => {
    const { id } = req.user;
    const {
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
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

const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);
        if (!user) {
            return next(new AppError("Unauthorized, please login"));
        }
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase a subscription!", 400));
        }

        const subscription_id = user.subscription.id;

        const subscription = await razorpay.subscriptions.cancel(subscription_id);

        user.subscription.status = subscription.status;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Unsubscribed successfully",
            subscription_id: subscription.id,
            subscription_status: subscription.status
        })
    } catch (e) {
        return next(new AppError(e.message, e.status));
    }
}
const allPayments = async (req, res) => {
    const { count } = req.query;

    const subscriptions = await razorpay.subscriptions.all({
        count: count || 10
    });

    res.status(200).json({
        success: true,
        message: "All payments",
        subscriptions
    })

}

export {
    getRazorPayApiKey,
    buySubscription,
    fetchSubscriptionById,
    verifySubscription,
    cancelSubscription,
    allPayments
}