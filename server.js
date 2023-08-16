import { config } from 'dotenv';
import app from './app.js';
import connectionToDB from './config/dbConnection.js';

config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`App is running at http://127.0.0.1:${PORT}`);
})