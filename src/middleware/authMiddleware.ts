import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../schema/userSchema";

const jsonsecret = process.env.JSON_SECRET!;

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jsonsecret) as { userId: string };

    const user = await UserModel.findById(decoded.userId);

    if (!user || user.token !== token)
      return res.status(401).json({ message: "Invalid token" });
    console.log("Decoded User:", user);

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
