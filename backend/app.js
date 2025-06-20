import express, { urlencoded } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"


const app = express();

const allowedOrigins = [
    "http://192.168.26.13:5173"  // your friend's frontend IP
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);



app.get("/", (req, res) => {
    console.log("request");
    res.status(200).json({ message: "Welcome Bitch" });
});

export default app;