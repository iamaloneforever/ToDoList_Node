import { Request, Response } from "express";
import TaskModel from "../schema/taskSchema";
import { z } from "zod";
import mongoose from "mongoose";

// ------------------- Zod Schema -------------------
const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional().default(""),
	dueDate: z.coerce.date().optional(),
	status: z
		.enum(["pending", "in-progress", "done", "canceled"])
		.default("pending"),
});

type TaskInput = z.infer<typeof taskSchema>;

// ------------------- Helpers -------------------
const getIdString = (id: string | string[]): string => {
	if (Array.isArray(id)) return id[0]; // اگر array بود اولین رو بگیر
	return id;
};

// ------------------- Get All Tasks -------------------
export const GetTasks = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		const tasks = await TaskModel.find({ user: user!._id });

		if (!tasks.length)
			return res.status(200).json({ message: "No Task Found" });

		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ error: `Server Error: ${error}` });
	}
};

// ------------------- Get Task by ID -------------------
export const FindTask = async (req: Request, res: Response) => {
	try {
		const id = getIdString(req.params.id);

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid MongoDB ID format" });
		}
		const user = req.user;

		const task = await TaskModel.find({ _id: id, user: user!._id });
		if (!task) return res.status(404).json({ message: "Task not found" });

		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ error: `Server Error: ${error}` });
	}
};

// ------------------- Add New Task -------------------
export const AddTask = async (req: Request, res: Response) => {
	try {
		const parsed: TaskInput = taskSchema.parse(req.body);

		const user = req.user;
		// console.log(`User`);
		// if (!user) return res.status(401).json({ message: "Unauthorized" });

		const task = new TaskModel({
			...parsed,
			user: user._id, // 🔥 لینک به یوزر
		});

		const savedTask = await task.save();

		res.status(201).json(savedTask);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.flatten() });
		}
		res.status(500).json({ error: `Server Error: ${error}` });
	}
};

// ------------------- Delete Task -------------------
export const DeleteTask = async (req: Request, res: Response) => {
	try {
		const id = getIdString(req.params.id);

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid MongoDB ID format" });
		}

		const user = req.user;

		const deletedTask = await TaskModel.findOneAndDelete({
			_id: id,
			user: user!._id, // 🔥 چک مالکیت
		});
		if (!deletedTask)
			return res.status(404).json({ message: "Task not found" });

		res.status(200).json({ message: "Task Deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: `Server Error: ${error}` });
	}
};
