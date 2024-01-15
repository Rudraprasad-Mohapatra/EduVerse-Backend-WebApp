import { Router } from "express";

import { lastMonthsalesData, userData, getMonthlySalesRecordsForYearData } from "../controllers/stat.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/auth.middleware.js";

const statRouter = Router();

statRouter.route('/users').get(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    userData);

statRouter.route('/lastmonthsales').get(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    lastMonthsalesData);

statRouter.route('/monthlysales').get(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    getMonthlySalesRecordsForYearData);

export default statRouter;