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

    constructor(FIREBASE_API_KEY, JWT_SECRET) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Try to use environment variable first, fallback to JSON file
        let serviceAccount;
        try {
            if (process.env.FIREBASE_ADMIN_SDK) {
                serviceAccount = JSON.parse(
                    Buffer.from(process.env.FIREBASE_ADMIN_SDK, 'base64').toString('utf8')
                );
            } else {
                // Fallback to reading the JSON file directly
                const serviceAccountPath = path.join(__dirname, '..', 'insuredsaathi-firebase-adminsdk-fbsvc-283eedf616.json');
                serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading Firebase admin SDK:', error.message);
            throw new Error('Failed to load Firebase admin SDK configuration');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

    }

    async PolicyHolderSignUp(req, res) {
        const { email, password, name, phone } = req.body;
        console.log(req.body);

        try {
            const userRecord = await admin.auth().createUser({
                email, password
            });

            console.log(userRecord);

            const firebaseUid = userRecord.uid;

            await admin.auth().setCustomUserClaims(firebaseUid, { role: 'policyHolder' });

            const newUserRecord = await User.create({ firebaseUid, name, email, phone });

            const token = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
                expiresIn: '5d'
            });

            //For Test
            res.setHeader("Set-Cookie", cookie.serialize("session", token, {
                httpOnly: true,
                secure: false,           // Use true only in HTTPS production
                sameSite: 'none',        // 🔥 Must be 'none' for cross-origin PATCH
                maxAge: 60 * 60 * 24 * 5,
                path: '/'
            }));



            res.status(201).json({
                message: "Created User Successfully",
                newUserRecord,
                token
            });

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

            const token = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
                expiresIn: '5d'
            });

            //For Test
            res.setHeader("Set-Cookie", cookie.serialize("session", token, {
                httpOnly: true,
                secure: false,           // Use true only in HTTPS production
                sameSite: 'none',        // 🔥 Must be 'none' for cross-origin PATCH
                maxAge: 60 * 60 * 24 * 5,
                path: '/'
            }));



            res.status(201).json({
                message: "Insurer created Succesfully",
                token
            });

        } catch (err) {
            console.log(err?.message);
            res.status(400).json({ message: err.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {

            const response = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
                {
                    email,
                    password,
                    returnSecureToken: true,
                }
            );

            const { idToken, localId: firebaseUid } = response.data;

            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const role = decodedToken.role;


            if (!role) {
                return res.status(404).json({ message: "No Role Defined, Contact Admin" });
            }

            let user;
            if (role === 'policyHolder') {
                user = await User.findOne({ firebaseUid });
            } else if (role === 'insurer') {
                user = await Insurer.findOne({ firebaseUid });
            } else {
                return res.status(400).json({ message: "Unknown Role" });
            }

            if (!user) {
                return res.status(404).json({ message: "No Such User in DB" });
            }

            const token = jwt.sign({ firebaseUid }, process.env.JWT_SECRET, {
                expiresIn: "5d",
            });

            //For Test
            res.setHeader("Set-Cookie", cookie.serialize("session", token, {
                httpOnly: true,
                secure: false,           // Use true only in HTTPS production
                sameSite: 'none',        // 🔥 Must be 'none' for cross-origin PATCH
                maxAge: 60 * 60 * 24 * 5,
                path: '/'
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
                token,
                ...responseUser
            });

        } catch (err) {
            console.log(err?.message);
            res.status(400).json({ message: err?.message });
        }
    }

    async logout(req, res) {
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

const authController = new AuthController(process.env.FIREBASE_API_KEY, process.env.JWT_SECRET);
export default authController;