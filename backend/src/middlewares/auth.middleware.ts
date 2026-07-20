import { type Request, type Response, type NextFunction } from "express";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "test_secret";

interface AuthRequest extends Request {
  user?: any;
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaching user payload to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };
