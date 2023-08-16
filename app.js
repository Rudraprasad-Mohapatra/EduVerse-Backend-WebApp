import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from "./routes/user.route.js"
import errorMiddleware from "./middlewares/error.middleware.js"
const app = express();
app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function(req, res){
    res.send("Pong")
})

app.use("/api/v1/user", userRoutes);
// routes of 3 modules

app.all("*", (req,res)=>{
    res.status(404).send("OOPS!! 404 page not found")
})

app.use(errorMiddleware);

export default app;