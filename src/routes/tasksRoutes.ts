import { Router } from "express";
import {
	AddTask,
	DeleteTask,
	FindTask,
	GetTasks,
	UpdateTask, // اضافه شد
} from "../controllers/taskController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", AuthMiddleware, GetTasks);
router.get("/:id", AuthMiddleware, FindTask);
router.post("/addtask", AuthMiddleware, AddTask);
router.delete("/:id", AuthMiddleware, DeleteTask);
router.patch("/:id", AuthMiddleware, UpdateTask);

export default router;
