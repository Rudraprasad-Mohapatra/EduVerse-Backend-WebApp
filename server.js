import { config } from 'dotenv';
import app from './app.js';
import connectionToDB from './config/dbConnection.js';
import cloudinary from "cloudinary";
import Razorpay from 'razorpay';

config();
const PORT = process.env.PORT || 5000;
// Cloudinary Configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const razorpay = new Razorpay({
    key_id: 'rzp_test_oR7PE0izBiNcDL',
    key_secret: '5yob6hLaqibrJQ5DtlbQqEnB',
});

app.listen(PORT, async () => {
    await connectionToDB();
    console.log(`App is running at http://127.0.0.1:${PORT}`);
})

export {
    razorpay
}