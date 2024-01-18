import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import userRoutes from "./routes/user.route.js"
import errorMiddleware from "./middlewares/error.middleware.js"
import courseRoutes from "./routes/course.route.js";
import paymentRoutes from './routes/payment.route.js';
import contactRoutes from "./routes/contact.route.js";
import AppError from './utils/error.util.js';
import statRoutes from "./routes/stat.route.js"

config();
const app = express();
const frontendUrlForProduction = process.env.FRONTEND_URL;
const frontendUrlForDevelopment = process.env.DEV_URL;

console.log(process.env.NODE_ENV);

app.use(express.json());

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [frontendUrlForProduction]
    : [frontendUrlForDevelopment, 'http://localhost:5173']; // Add other local development URLs as needed

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new AppError("Not allowed by CORS"));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Include the necessary HTTP methods
    credentials: true,
    optionsSuccessStatus: 204,
}));


app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/", function (req, res) {
    res.send("Hello User !")
})

app.use("/ping", function (req, res) {
    res.send("Pong")
})

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/contact", contactRoutes);

app.use("/api/v1/admin/stats", statRoutes);


app.all("*", (req, res) => {
    res.status(404).send("OOPS!! 404 page not found")
})

app.use(errorMiddleware);

export default app;