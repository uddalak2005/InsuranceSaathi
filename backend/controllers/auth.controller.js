import admin from "firebase-admin";
import cookie from "cookie"
import dotenv from "dotenv"
import path from "path";
import User from "../models/user.model.js"
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import Insurer from "../models/insurer.model.js";

class AuthController {

    constructor(FIREBASE_API_KEY, JWT_SECRET) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const serviceAccount = JSON.parse(
            readFileSync(path.join(__dirname, "../insuredsaathi-firebase-adminsdk-fbsvc-283eedf616.json"), "utf8")
        );


        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        dotenv.config({ path: path.resolve(__dirname, '../.env') });

        this.FIREBASE_API_KEY = FIREBASE_API_KEY;
        this.JWT_SECRET = JWT_SECRET;
    }

    async PolicyHolderSignUp(req, res) {
        const { email, password, name, phone } = req.body;

        try {
            const userRecord = await admin.auth().createUser({
                email, password
            });

            const firebaseUid = userRecord.uid;

            await admin.auth().setCustomUserClaims(firebaseUid, { role: 'policyHolder' });

            await User.create({ firebaseUid, name, email, phone });

            const token = jwt.sign({ firebaseUid }, this.JWT_SECRET, {
                expiresIn: '5d'
            });

            res.setHeader("Set-Cookie", cookie.serialize("session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 5,
                sameSite: 'strict',
                path: '/',
            }));

            res.status(201).json({ message: "Created User Successfully" });

        } catch (err) {
            res.status(400).json({ message: err?.message });
        }
    }

    async InsurerSignUp(req, res) {
        const { orgName, email, password } = req.body;

        try {
            const insurerRecord = await admin.auth().createUser({
                email, password
            });

            const firebaseUid = insurerRecord.uid;

            await admin.auth().setCustomUserClaims(firebaseUid, { role: 'insurer' })

            await Insurer.create({
                firebaseUid: firebaseUid,
                orgName: orgName,
                email: email
            })

            const token = jwt.sign({ firebaseUid }, this.JWT_SECRET, {
                expiresIn: '5d'
            });

            res.setHeader("Set-Cookie", cookie.serialize("session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 5,
                sameSite: 'strict',
                path: '/'
            }));

            res.status(201).json({ message: "Insurer created Succesfully" });
        } catch (err) {
            console.log(err?.message);
            res.status(400).json({ message: err?.message });
        }
    }

}

const authController = new AuthController(process.env.FIREBASE_API_KEY, process.env.JWT_SECRET);
export default authController;