import AppError from "../utils/error.util.js";
import JWT from "jsonwebtoken";
const isLoggedIn = async function (req, res, next) {
    const { token } = req.cookies;
    // const token = (req.cookies && req.cookies.token) || null;
    if (!token) {
        return next(new AppError("Unauthenticated ,please login again", 401));
    }

    const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
}

const authorizedRoles = (...roles) => async (req, res, next) => {
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError("You do not have permission to access this route", 403));
    }
    next();
}
export {
    isLoggedIn,
    authorizedRoles
}