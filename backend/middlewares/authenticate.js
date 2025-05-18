import { verifyToken } from "../utils/generateToken.js";
import { User } from "../models/user.js";
import { redisClient } from "../config/redis.js";

export const authenticate = async (req, res, next) => {
    const excludeRoutes = [
        "/auth/register",
        "/auth/login",
        "/auth/forgot-password",
        "/auth/verify-otp",
        "/auth/verify-account",
        "/auth/get-otp",
    ];

    if (excludeRoutes.includes(req.path) || req.path.startsWith("/api-docs")) {
        return next();
    }

    // Getting token from cookie
    // console.log("Request path:", req.path);
    // console.log("Request cookies:", req.cookies);
    // console.log("Request headers:", req.headers);

    let authToken = req.cookies.token;

    // If no cookie, try to get from Authorization header
    // if (!authToken && req.headers.authorization) {
    //     authToken = req.headers.authorization.split(" ")[1];
    // }

    
    if (!authToken) {
        console.log("Token not provided");
        return res.status(401).json({ error: "Token not provided" });
    }

    try {
        const isBlacklisted = await redisClient.get(`blacklisted: ${authToken}`);
        // console.log("Is token blacklisted:", isBlacklisted);

        if (isBlacklisted) {
            console.log("Token is Invalidated");
            return res.status(401).json({ error: "Token is Invalidated" });
        }

        const decodedToken = verifyToken(authToken);
        // console.log("Decoded token:", decodedToken);

        const user = await User.findById(decodedToken.id).select('-password');
        // console.log("Found user:", user ? "Yes" : "No");
        
        if (!user) {
            return res.status(404).json({ error: "Invalid Token" });
        }
        
        if (user.status === "blocked") {
            return res.status(403).json({ error: "This Account has been blocked" });
        }

        req.user = user;
        req.user.id = decodedToken.id;
        req.user.exp = decodedToken.exp;

    
        // Only set socket.request.user if socket exists and has a request property
        // if (socket && socket.request) {
        //     socket.request.user = user;
        // }
       
        next();
    } catch (err) {
        console.log("Error from authentication middleware:", err);
        return res.status(401).json({ error: err.message });
    }
};