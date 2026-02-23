import { Request, Response } from "express";
import Task from "../schema/taskSchema";
export const GetTasks = async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find();
		if (tasks.length == 0) {
			res.status(200).json({ "message : ": "No Task Found" });
		}
		res.status(200).json(tasks);
	} catch {
		res.status(500).json({ Error: "Server Error" });
	}
};
