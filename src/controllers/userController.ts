import { Request, Response } from "express";
import * as z from "zod";
import UserModel from "../schema/userSchema";
import jwt from "jsonwebtoken";

const jsonsecret = process.env.JSON_SECRET;
if (!jsonsecret) throw new Error("JSON_SECRET is not defined");

const userSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserInput = z.infer<typeof userSchema>;

export const RegisterUser = async (req: Request, res: Response) => {
	try {
		const parsed: UserInput = userSchema.parse(req.body);
		const user = new UserModel(parsed);
		const token = jwt.sign({ userId: user._id }, jsonsecret, {
			expiresIn: "1h",
		});
		user.token = token;
		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
	}
};
