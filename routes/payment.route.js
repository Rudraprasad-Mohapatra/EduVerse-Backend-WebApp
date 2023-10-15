import { Router } from "express";
import { authorizeSubscriber, authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const paymentRoutes = Router();

import {
    getRazorPayApiKey,
    buySubscription,
    fetchSubscriptionById,
    verifySubscription,
    cancelSubscription,
    allPayments
} from "../controllers/payment.controller.js"

paymentRoutes.route("/razorpay-key")
    .get(isLoggedIn,
        getRazorPayApiKey
    );

paymentRoutes.route("/subscribe")
    .post(
        isLoggedIn,
        buySubscription
    );
paymentRoutes.route("/subscriptions/:sub_id")
    .get(
        isLoggedIn,
        fetchSubscriptionById
    );

paymentRoutes.route("/verify")
    .post(
        isLoggedIn,
        verifySubscription
    );

paymentRoutes.route("/unsubscribe")
    .post(isLoggedIn,
        authorizeSubscriber,
        cancelSubscription
    );

paymentRoutes.route("/")
    .get(isLoggedIn,
        authorizedRoles("ADMIN"),
        allPayments
    );

export default paymentRoutes;
