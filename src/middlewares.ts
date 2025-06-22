import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_PASSWORD || '';

// Debug logging
console.log("🔍 JWT_SECRET loaded:", JWT_SECRET ? "YES (length: " + JWT_SECRET.length + ")" : "NO");
console.log("🔍 JWT_PASSWORD from env:", process.env.JWT_PASSWORD ? "YES" : "NO");

export const userMiddleware = (req: Request, res: Response, next: NextFunction): Response => {
    const authHeader = req.headers["authorization"];
    
    // Debug logging
    console.log("🔍 Auth header received:", authHeader ? "YES" : "NO");
    console.log("🔍 Auth header value:", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Authentication header is missing or invalid"
        });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Token extracted:", token ? "YES (length: " + token.length + ")" : "NO");

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log("🔍 Token decoded successfully:", decoded);
        
        if (!decoded || !decoded.userId) {
            return res.status(403).json({
                message: "Invalid token. No user ID exists"
            });
        }
        (req as any).userId = decoded.userId;
        next();
        return res;
    } catch (error) {
        console.log("🔍 JWT verification failed:", error);
        return res.status(403).json({
            message: "Authentication failed. Please check your credentials"
        });
    }
}

