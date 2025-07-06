import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../controllers/message.controller";

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string
}

const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
      return;
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      res.status(500).json({ error: "JWT Secret not configured" });
      return
    }

    const decoded = jwt.verify(token, secret) as JwtPayloadWithUserId;

    if (!decoded || !decoded.userId) {
      res.status(404).json({ error: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;

    next();

  } catch (error) {
    console.log("Error in protect route", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default protectRoute;