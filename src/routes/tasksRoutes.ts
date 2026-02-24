import { Router } from "express";
import {
	AddTask,
	DeleteTask,
	FindTask,
	GetTasks,
} from "../controllers/taskController";

const router = Router();

router.get("/", GetTasks);
router.get("/:id", FindTask);
router.post("/addtask", AddTask);
router.delete("/:id", DeleteTask);

export default router;
