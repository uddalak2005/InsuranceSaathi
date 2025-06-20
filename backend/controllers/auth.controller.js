import admin from "firebase-admin";
import cookie from "cookie"
import axios from "axios";
import dotenv from "dotenv"
import path from "path";
import User from "../models/user.model.js"
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import Insurer from "../models/insurer.model.js";

class AuthController {

    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const serviceAccount = JSON.parse(
            readFileSync(path.join(__dirname, "../insuredsaathi-firebase-adminsdk-fbsvc-283eedf616.json"), "utf8")
        );


        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    PolicyHolderSignUp = async (req, res) => {
        const { email, password, name, phone } = req.body;

        try {
            const userRecord = await admin.auth().createUser({
                email, password
            });

            const firebaseUid = userRecord.uid;

            await admin.auth().setCustomUserClaims(firebaseUid, { role: 'policyHolder' });

            await User.create({ firebaseUid, name, email, phone });

            const token = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
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

    InsurerSignUp = async (req, res) => {
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

            const token = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
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

    login = async (req, res) => {
        const { email, password } = req.body;

        console.log("Login attempt for:", email);

        try {
            console.log("Using Firebase API Key:", process.env.FIREBASE_API_KEY ? "Present" : "Missing");
            console.log("Request payload:", { email, password: "***", returnSecureToken: true });
            
            // Use Firebase REST API for password authentication
            const response = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
                {
                    email,
                    password,
                    returnSecureToken: true,
                }
            );

            console.log("Firebase auth successful");

            const { idToken, localId: firebaseUid } = response.data;

            // Verify the ID token with Admin SDK to get custom claims
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const role = decodedToken.role;

            console.log("User found with role:", role);

            if (!role) {
                return res.status(404).json({ message: "No Role Defined, Contact Admin" });
            }

            let user;
            if (role === 'policyHolder') {
                user = await User.findOne({ firebaseUid });
            } else if (role === 'insurer') {
                user = await Insurer.findOne({ firebaseUid });
            } else {
                console.log("Unknown Role:", role);
                return res.status(400).json({ message: "Unknown Role" });
            }

            if (!user) {
                return res.status(404).json({ message: "No Such User in DB" });
            }

            const jwtToken = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
                expiresIn: "5d",
            });

            res.setHeader("Set-Cookie", cookie.serialize("session", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 5,
                sameSite: "strict",
                path: "/",
            }));

            let responseUser;

            if (role === 'policyHolder') {
                responseUser = {
                    policyHolder: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: role
                    }
                };
            } else {
                responseUser = {
                    insurer: {
                        orgName: user.orgName,
                        email: user.email,
                        role: role
                    }
                };
            }

            res.status(200).json({
                message: "Login Successful",
                ...responseUser
            });

        } catch (err) {
            console.log("Login error:", err?.message);
            console.log("Full error object:", JSON.stringify(err, null, 2));
            
            // Handle Firebase REST API errors
            if (err?.response?.data?.error?.message) {
                const firebaseError = err.response.data.error.message;
                console.log("Firebase error message:", firebaseError);
                if (firebaseError.includes('INVALID_PASSWORD') || firebaseError.includes('EMAIL_NOT_FOUND') || firebaseError.includes('INVALID_LOGIN_CREDENTIALS')) {
                    return res.status(401).json({ message: "Invalid email or password" });
                } else if (firebaseError.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
                    return res.status(429).json({ message: "Too many failed attempts. Try again later." });
                } else {
                    return res.status(400).json({ message: firebaseError });
                }
            } else {
                return res.status(400).json({ message: err?.message || "Login failed" });
            }
        }
    }

    logout = async (req, res) => {
        res.setHeader("Set-Cookie", cookie.serialize("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            sameSite: "strict",
            path: "/",
        }));
        res.status(200).json({ message: "Logged out successfully" });
    }

}

const authController = new AuthController();
export default authController;