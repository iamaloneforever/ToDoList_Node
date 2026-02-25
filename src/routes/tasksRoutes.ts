import { Router } from "express";
import {
	AddTask,
	DeleteTask,
	FindTask,
	GetTasks,
} from "../controllers/taskController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

// 🔐 همه این روت‌ها نیاز به لاگین دارن
router.get("/", AuthMiddleware, GetTasks);
router.get("/:id", AuthMiddleware, FindTask);
router.post("/addtask", AuthMiddleware, AddTask);
router.delete("/:id", AuthMiddleware, DeleteTask);

export default router;
