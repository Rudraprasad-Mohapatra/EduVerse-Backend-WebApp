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

config();
const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(express.json());

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function (req, res) {
    res.send("Pong")
})

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/contact", contactRoutes);


app.all("*", (req, res) => {
    res.status(404).send("OOPS!! 404 page not found")
})

app.use(errorMiddleware);

export default app;