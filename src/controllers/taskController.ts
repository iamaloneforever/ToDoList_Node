import { Request, Response } from "express";
import TaskModel from "../schema/taskSchema";
import { z } from "zod";
import mongoose from "mongoose";

// ------------------- Zod Schema -------------------
const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional().default(""),
	dueDate: z.coerce
		.date()
		.optional()
		.refine((date) => !date || date > new Date(), {
			message: "dueDate must be in the future",
		}),
	status: z
		.enum(["pending", "in-progress", "done", "canceled"])
		.default("pending"),
});

type TaskInput = z.infer<typeof taskSchema>;

// ------------------- Helpers -------------------
const getIdString = (id: string | string[]): string => {
	if (Array.isArray(id)) return id[0];
	return id;
};

// ------------------- Get All Tasks -------------------
export const GetTasks = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		const { status, title, dueBefore, dueAfter } = req.query;

		const filter: any = { user: user!._id };

		if (status) filter.status = status; // مثال: "done"
		if (title) filter.title = { $regex: title, $options: "i" };
		if (dueBefore)
			filter.dueDate = {
				...filter.dueDate,
				$lt: new Date(dueBefore as string),
			};
		if (dueAfter)
			filter.dueDate = { ...filter.dueDate, $gt: new Date(dueAfter as string) };

		const tasks = await TaskModel.find(filter);

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

export const UpdateTask = async (req: Request, res: Response) => {
	try {
		const id = getIdString(req.params.id);

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid MongoDB ID format" });
		}

		const user = req.user;

		const parsed: Partial<TaskInput> = taskSchema.partial().parse(req.body);

		const updatedTask = await TaskModel.findOneAndUpdate(
			{ _id: id, user: user!._id },
			{ $set: parsed },
			{ returnDocument: "after" }, // 🔹 جدید و بدون هشدار
		);
		if (!updatedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.status(200).json(updatedTask);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.flatten() });
		}
		res.status(500).json({ error: `Server Error: ${error}` });
	}
};
