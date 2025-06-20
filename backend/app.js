import express, { urlencoded } from "express";
import cors from "cors"


const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(urlencoded({ extended: true }));
app.use(express.json());



app.get("/", (req, res) => {
    console.log("request");
    res.status(200).json({message : "Welcome Bitch"});
});

export default app;