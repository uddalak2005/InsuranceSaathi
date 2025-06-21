import jwt from "jsonwebtoken";
import cookie from "cookie";

async function verifyAuth(req, res, next) {
    try {
        console.log("JWT : ",req.headers.token);
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: "No Token found" });
        }

        // const { session } = cookie.parse(cookies);

        // if (!session) {
        //     return res.status(401).json({ message: "No Session token found" });
        // }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { firebaseUid: decoded.firebaseUid };

        next();
    } catch (err) {
        return res.status(400).json({ message: err?.message || "Token verification failed" });
    }
}


export default verifyAuth;
