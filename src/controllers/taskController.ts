import { Request, Response } from "express";
import Task from "../schema/taskSchema";
import { z } from "zod";

const taskSchema = z.object({
	title: z.string().min(1, "Title is required"), // Required field with minimum length
	description: z.string().optional().default(""), // Optional field with default value
	dueDate: z.coerce.date(), // Date validation
	status: z
		.enum(["pending", "in-progress", "done", "canceled"])
		.default("pending"),
});

type Task = z.infer<typeof taskSchema>;

export const GetTasks = async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find();
		if (tasks.length == 0) {
			res.status(200).json({ "message : ": "No Task Found" });
		}
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ Error: `Server Error : ${error}` });
	}
};

export const FindTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ Error: `Server Error : ${error}` });
	}
};

export const AddTask = async (req: Request, res: Response) => {
	try {
		const parsed = taskSchema.parse(req.body);
		const task = new Task(parsed);
		const savedTask = await task.save();
		res.status(201).json(savedTask);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				errors: error.format(), // Format errors for better readability
			});
		}
		res.status(500).json({ Error: `Server Error : ${error}` });
	}
};

export const DeleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deletedTask = await Task.findByIdAndDelete(id);
		if (!deletedTask) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.status(200).json({ message: "Task Deleted successfully" });
	} catch (error) {
		res.status(500).json({ Error: `Server Error : ${error}` });
	}
};
