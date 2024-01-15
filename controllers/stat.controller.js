import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js"

const userData = async (req, res, next) => {
    try {
        const subscriptions = await razorpay.subscriptions.all({
            plan_id: process.env.RAZORPAY_PLAN_ID,
        })

        const filteredCompletedSubscriptions = subscriptions.items.filter(subscription => subscription.status == "completed");

        const filteredRegisteredSubscriptions = subscriptions.items.filter(subscription => subscription.status !== "completed");

        res.status(200).json({
            success: true,
            message: "fetched users data successfully",
            subscribedCount: filteredCompletedSubscriptions.length,
            registeredCount: filteredRegisteredSubscriptions.length,
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

const lastMonthsalesData = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0) > currentDate ? currentDate : new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        const subscriptionData = await razorpay.subscriptions.all();

        const lastMonthSubscriptions = subscriptionData.items.filter((subscription) => {
            const subscriptionCreatedAt = new Date(subscription.created_at * 1000); // Assuming created_at is in seconds
            return (
                subscriptionCreatedAt >= lastMonthStartDate && subscriptionCreatedAt <= lastMonthEndDate
            );
        });

        const completedSubscriptions = lastMonthSubscriptions.filter(subscription => subscription.status === 'completed');

        res.status(200).json({
            success: true,
            message: "fetched lastmonth sales data successfully",
            lastMonthSales: completedSubscriptions.length
        })

    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

const getMonthlySalesRecordsForYearData = async (req, res, next) => {
    try {
        const year = req.query.year || 2024;
        const monthlySalesArray = [];

        // Helper function to group subscriptions by month
        const groupSubscriptionsByMonth = (subscriptions) => {
            const groupedSubscriptions = Array.from({ length: 12 }, (_, monthIndex) => ({
                month: monthIndex + 1,
                subscriptions: []
            }));

            subscriptions.forEach(subscription => {
                const subscriptionDate = new Date(subscription.created_at * 1000);
                const monthIndex = subscriptionDate.getMonth();

                groupedSubscriptions[monthIndex].subscriptions.push(subscription);
            });

            return groupedSubscriptions;
        }

        if (year) {
            const response = await razorpay.subscriptions.all();

            // filter subscriptions for the specified year
            const subscriptionsForYear = response.items.filter(subscription => {
                const subscriptiondate = new Date(subscription.created_at * 1000);
                return subscriptiondate.getFullYear() == year;
            });

            // Group subscriptions by month
            const groupedSubscriptions = groupSubscriptionsByMonth(subscriptionsForYear);

            monthlySalesArray.push(...groupedSubscriptions);

            const monthlyCompletedSubscriptions = monthlySalesArray.map((ele) => {
                let count = 0;
                for(let i = 0; i < ele.subscriptions.length; i++) {
                    if(ele.subscriptions[i].status == "completed"){
                        count += 1;
                    }
                }
                return count;
            })

            res.status(200).json({
                success: true,
                message: `fetched ${year}'s sales data successfully`,
                monthlysales: monthlySalesArray,
                monthlyCompletedSubscriptions: monthlyCompletedSubscriptions,
            })
        }
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

export {
    userData,
    lastMonthsalesData,
    getMonthlySalesRecordsForYearData
}