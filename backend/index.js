import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose"

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;



/**
 * To establish connection with mongoDB database
 * @returns {Promise<Void>}
 * @throws {Error}
 */

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`);
    });
}).catch(err => {
    console.log(err);
});