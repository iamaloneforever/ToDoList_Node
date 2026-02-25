import { Request, Response } from "express";
import * as z from "zod";
import UserModel from "../schema/userSchema";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";

const jsonsecret = process.env.JSON_SECRET;
if (!jsonsecret) throw new Error("JSON_SECRET is not defined");

const UserSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterSchema = UserSchema.extend({
	username: z.string().min(3, "Username must be at least 3 characters"),
});

type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof UserSchema>;

// ================= REGISTER =================

export const RegisterUser = async (req: Request, res: Response) => {
	try {
		const parsed: RegisterInput = RegisterSchema.parse(req.body);

		const existingUser = await UserModel.findOne({
			$or: [{ email: parsed.email }, { username: parsed.username }],
		});

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = new UserModel(parsed);

		const token = generateToken(user.id);

		user.token = token;

		await user.save();

		res.status(201).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		res.status(500).json({ error: "Server Error" });
	}
};

// ================= LOGIN =================

export const LoginUser = async (req: Request, res: Response) => {
	try {
		const parsed: LoginInput = UserSchema.parse(req.body);

		const user = await UserModel.findOne({ email: parsed.email });

		if (!user || user.password !== parsed.password) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = generateToken(user.id);

		user.token = token;
		await user.save();

		res.status(200).json({ token });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		res.status(500).json({ error: "Server Error" });
	}
};
