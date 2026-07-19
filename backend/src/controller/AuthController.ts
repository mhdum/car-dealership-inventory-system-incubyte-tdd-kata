// src/controllers/auth.controller.ts
import { type Request, type Response, type NextFunction } from "express";
const { loginUser } = require("../services/UserLoginService");

async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Pass execution directly to the service layer
    const result = await loginUser(req.body);

    // If successful, return the JWT and clean user object
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error: any) {
    // Map your specific service error messages to the standard 401 response
    if (error.message === "Invalid email or password") {
      res.status(401).json({
        status: "fail",
        message: error.message,
      });
      return;
    }

    // Forward anything unexpected (DB failure, etc.) to Express error handling
    next(error);
  }
}

module.exports = {
  loginController,
};
